import React, { useMemo, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import StatCard from '../components/StatCard';
import { UserProfile, WorkoutSession } from '../types/cardio';

interface DashboardScreenProps {
  workouts: WorkoutSession[];
  profile: UserProfile;
}

const isInLastDays = (dateString: string, days: number) => {
  const date = new Date(dateString).getTime();
  const limit = Date.now() - days * 24 * 60 * 60 * 1000;
  return date >= limit;
};

export default function DashboardScreen({ workouts, profile }: DashboardScreenProps) {
  const [liveHeartRate, setLiveHeartRate] = useState(profile.targetHeartRateMin + 10);
  const tickRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current += 1;
      const zoneMidpoint = (profile.targetHeartRateMin + profile.targetHeartRateMax) / 2;
      const amplitude = Math.max(6, Math.round((profile.targetHeartRateMax - profile.targetHeartRateMin) / 2));
      const nextHeartRate = Math.round(zoneMidpoint + Math.sin(tickRef.current / 2.5) * amplitude);
      setLiveHeartRate(Math.max(profile.targetHeartRateMin - 15, Math.min(profile.targetHeartRateMax + 10, nextHeartRate)));
    }, 2000);

    return () => clearInterval(id);
  }, [profile.targetHeartRateMax, profile.targetHeartRateMin]);

  const stats = useMemo(() => {
    const weekWorkouts = workouts.filter((workout) => isInLastDays(workout.endTime, 7));
    const monthWorkouts = workouts.filter((workout) => isInLastDays(workout.endTime, 30));

    const weekMinutes = weekWorkouts.reduce((sum, workout) => sum + workout.durationSeconds / 60, 0);
    const monthMinutes = monthWorkouts.reduce((sum, workout) => sum + workout.durationSeconds / 60, 0);

    const avgHeartRate =
      workouts.length === 0
        ? 0
        : Math.round(workouts.reduce((sum, workout) => sum + workout.avgHeartRate, 0) / workouts.length);

    return {
      weekMinutes: Math.round(weekMinutes),
      monthMinutes: Math.round(monthMinutes),
      avgHeartRate,
      workoutCount: workouts.length,
    };
  }, [workouts]);

  const recentWorkouts = workouts.slice(0, 4);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Welcome back, {profile.name}</Text>
      <Text style={styles.title}>Cardio Dashboard</Text>

      <View style={styles.heartRateCard}>
        <Text style={styles.cardTitle}>Live Heart Rate</Text>
        <Text style={styles.heartRateValue}>{liveHeartRate} BPM</Text>
        <Text style={styles.heartRateTarget}>
          Target zone: {profile.targetHeartRateMin} - {profile.targetHeartRateMax} BPM
        </Text>
      </View>

      <View style={styles.gridRow}>
        <StatCard label="Workouts" value={`${stats.workoutCount}`} />
        <View style={styles.gap} />
        <StatCard label="Avg HR" value={`${stats.avgHeartRate} BPM`} accent="#0ea5e9" />
      </View>
      <View style={styles.gridRow}>
        <StatCard label="Week" value={`${stats.weekMinutes} min`} accent="#22c55e" />
        <View style={styles.gap} />
        <StatCard label="Month" value={`${stats.monthMinutes} min`} accent="#8b5cf6" />
      </View>

      <Text style={styles.sectionTitle}>Recent Workouts</Text>
      {recentWorkouts.length === 0 ? (
        <Text style={styles.emptyText}>No workouts yet. Start your first session in the Workout tab.</Text>
      ) : (
        recentWorkouts.map((workout) => (
          <View key={workout.id} style={styles.workoutItem}>
            <View>
              <Text style={styles.workoutDate}>{new Date(workout.endTime).toLocaleDateString()}</Text>
              <Text style={styles.workoutMeta}>{Math.round(workout.durationSeconds / 60)} min · {workout.avgHeartRate} BPM avg</Text>
            </View>
            <Text style={styles.workoutCalories}>{workout.calories} kcal</Text>
          </View>
        ))
      )}
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
  greeting: {
    color: '#64748b',
    fontSize: 14,
  },
  title: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  heartRateCard: {
    backgroundColor: '#ef4444',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: {
    color: '#fee2e2',
    fontSize: 14,
    fontWeight: '500',
  },
  heartRateValue: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '700',
    marginTop: 8,
  },
  heartRateTarget: {
    color: '#fee2e2',
    marginTop: 8,
    fontSize: 13,
  },
  gridRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  gap: {
    width: 10,
  },
  sectionTitle: {
    marginTop: 22,
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyText: {
    color: '#64748b',
    lineHeight: 20,
  },
  workoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
  },
  workoutDate: {
    fontWeight: '600',
    color: '#0f172a',
  },
  workoutMeta: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 13,
  },
  workoutCalories: {
    color: '#ef4444',
    fontWeight: '700',
  },
});
