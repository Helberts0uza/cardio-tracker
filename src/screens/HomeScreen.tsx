import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeartRateDisplay from '../components/HeartRateDisplay';
import StatCard from '../components/StatCard';
import { useWorkout } from '../context/WorkoutContext';
import { useUser } from '../context/UserContext';
import { getDailyStats, formatDuration } from '../utils/calculations';

export default function HomeScreen({ navigation }: any) {
  const { workouts, loading } = useWorkout();
  const { user } = useUser();
  const [currentHR, setCurrentHR] = useState(125);
  const [todayStats, setTodayStats] = useState<any>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const stats = getDailyStats(workouts, today);
    setTodayStats(stats);

    // Simulate HR changes
    const interval = setInterval(() => {
      setCurrentHR(Math.floor(Math.random() * 60) + 100);
    }, 2000);

    return () => clearInterval(interval);
  }, [workouts]);

  if (loading || !user || !todayStats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  const lastWorkout = workouts[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.name}>{user.name}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')}>
            <View style={styles.avatarButton}>
              <Ionicons name="person" size={24} color="#FF6B6B" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Heart Rate Display */}
        <View style={styles.hrContainer}>
          <HeartRateDisplay bpm={currentHR} maxHeartRate={user.maxHeartRate} />
        </View>

        {/* Today's Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="flame"
              title="Calories"
              value={todayStats.totalCalories}
              unit="kcal"
              color="#FF6B6B"
            />
            <StatCard
              icon="location"
              title="Distance"
              value={todayStats.totalDistance.toFixed(1)}
              unit="km"
              color="#4CAF50"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              icon="time"
              title="Duration"
              value={todayStats.workouts}
              unit="workouts"
              color="#2196F3"
            />
            <StatCard
              icon="pulse"
              title="Avg HR"
              value={todayStats.avgHeartRate}
              unit="bpm"
              color="#FF9800"
            />
          </View>
        </View>

        {/* Last Workout */}
        {lastWorkout && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Last Workout</Text>
            <TouchableOpacity
              style={styles.workoutCard}
              onPress={() => navigation.navigate('WorkoutDetail', { workoutId: lastWorkout.id })}
            >
              <View style={styles.workoutIcon}>
                <Ionicons 
                  name={lastWorkout.type === 'running' ? 'walk' : 'bicycle'} 
                  size={32} 
                  color="#FF6B6B" 
                />
              </View>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutType}>
                  {lastWorkout.type.charAt(0).toUpperCase() + lastWorkout.type.slice(1)}
                </Text>
                <Text style={styles.workoutDate}>{lastWorkout.date}</Text>
              </View>
              <View style={styles.workoutStats}>
                <View style={styles.workoutStatItem}>
                  <Text style={styles.workoutStatLabel}>Duration</Text>
                  <Text style={styles.workoutStatValue}>{formatDuration(lastWorkout.duration)}</Text>
                </View>
                <View style={styles.workoutStatItem}>
                  <Text style={styles.workoutStatLabel}>HR</Text>
                  <Text style={styles.workoutStatValue}>{lastWorkout.avgHeartRate} bpm</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="play-circle" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Start Workout</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  greeting: {
    fontSize: 14,
    color: '#999',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hrContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
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
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  workoutIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFE0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  workoutDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 12,
  },
  workoutStatItem: {
    alignItems: 'center',
  },
  workoutStatLabel: {
    fontSize: 10,
    color: '#999',
  },
  workoutStatValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
