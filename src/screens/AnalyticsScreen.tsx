import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useWorkout } from '../context/WorkoutContext';
import { getWeeklyStats, getMonthlyStats } from '../utils/calculations';
import StatCard from '../components/StatCard';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const { workouts, loading } = useWorkout();
  const [weeklyStats, setWeeklyStats] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<any>(null);

  useEffect(() => {
    const weekly = getWeeklyStats(workouts);
    setWeeklyStats(weekly);
    
    const monthly = getMonthlyStats(workouts);
    setMonthlyStats(monthly);
  }, [workouts]);

  if (loading || !monthlyStats || weeklyStats.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  const calorieData = {
    labels: weeklyStats.map(d => d.day),
    datasets: [
      {
        data: weeklyStats.map(d => d.calories),
        strokeWidth: 2,
        color: () => '#FF6B6B',
      },
    ],
  };

  const workoutData = {
    labels: weeklyStats.map(d => d.day),
    datasets: [
      {
        data: weeklyStats.map(d => d.workouts),
        fillShadowGradient: '#FF6B6B',
        fillShadowGradientOpacity: 0.1,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Monthly Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="calendar"
              title="Workouts"
              value={monthlyStats.totalWorkouts}
              color="#FF6B6B"
            />
            <StatCard
              icon="flame"
              title="Calories"
              value={monthlyStats.totalCalories}
              unit="kcal"
              color="#4CAF50"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              icon="location"
              title="Distance"
              value={monthlyStats.totalDistance.toFixed(1)}
              unit="km"
              color="#2196F3"
            />
            <StatCard
              icon="pulse"
              title="Avg HR"
              value={monthlyStats.avgHeartRate}
              unit="bpm"
              color="#FF9800"
            />
          </View>
        </View>

        {/* Weekly Calories Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Calories Burned</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={calorieData}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: () => '#FF6B6B',
                labelColor: () => '#999',
                style: {
                  borderRadius: 12,
                },
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#FF6B6B',
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Weekly Workouts Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Workouts</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={workoutData}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: () => '#FF6B6B',
                labelColor: () => '#999',
                style: {
                  borderRadius: 12,
                },
              }}
              style={styles.chart}
            />
          </View>
        </View>

        {/* Additional Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.durationCard}>
            <Text style={styles.durationValue}>
              {Math.round(monthlyStats.totalDuration / 60)}
            </Text>
            <Text style={styles.durationLabel}>minutes</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chart: {
    borderRadius: 12,
  },
  durationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  durationValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  durationLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});
