import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { WorkoutSession } from '../types/cardio';

interface AnalyticsScreenProps {
  workouts: WorkoutSession[];
}

const startOfDay = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

export default function AnalyticsScreen({ workouts }: AnalyticsScreenProps) {
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width - 36, 700);

  const data = useMemo(() => {
    const now = startOfDay(new Date());

    const weekPoints = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - index));

      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      const minutes = workouts
        .filter((w) => {
          const end = new Date(w.endTime);
          return end >= day && end < nextDay;
        })
        .reduce((sum, workout) => sum + workout.durationSeconds / 60, 0);

      return {
        label: day.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 3),
        minutes: Math.round(minutes),
      };
    });

    const monthPoints = Array.from({ length: 4 }, (_, index) => {
      const end = new Date(now);
      end.setDate(now.getDate() - index * 7);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);

      const minutes = workouts
        .filter((w) => {
          const date = new Date(w.endTime);
          return date >= start && date <= end;
        })
        .reduce((sum, workout) => sum + workout.durationSeconds / 60, 0);

      return {
        label: `W${4 - index}`,
        minutes: Math.round(minutes),
      };
    }).reverse();

    const monthlyTotal = monthPoints.reduce((sum, point) => sum + point.minutes, 0);

    return { weekPoints, monthPoints, monthlyTotal };
  }, [workouts]);

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
    labelColor: () => '#334155',
    decimalPlaces: 0,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#ef4444',
    },
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>Weekly and monthly cardio trends</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weekly Minutes</Text>
        <BarChart
          data={{
            labels: data.weekPoints.map((point) => point.label),
            datasets: [{ data: data.weekPoints.map((point) => point.minutes) }],
          }}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
          yAxisLabel=""
          yAxisSuffix="m"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Progress (last 4 weeks)</Text>
        <LineChart
          data={{
            labels: data.monthPoints.map((point) => point.label),
            datasets: [{ data: data.monthPoints.map((point) => point.minutes) }],
          }}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
          yAxisLabel=""
          yAxisSuffix="m"
        />
        <Text style={styles.monthlyTotal}>Total in 4 weeks: {data.monthlyTotal} min</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 18,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 6,
    color: '#64748b',
  },
  card: {
    marginTop: 18,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  chart: {
    borderRadius: 12,
  },
  monthlyTotal: {
    marginTop: 10,
    color: '#334155',
    fontWeight: '600',
  },
});
