import React from 'react';
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
import { useWorkout } from '../context/WorkoutContext';
import { formatDuration } from '../utils/calculations';
import HeartRateDisplay from '../components/HeartRateDisplay';
import { useUser } from '../context/UserContext';

export default function WorkoutDetailScreen({ route }: any) {
  const { workoutId } = route.params;
  const { getWorkoutById, loading } = useWorkout();
  const { user } = useUser();

  const workout = getWorkoutById(workoutId);

  if (loading || !workout || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Heart Rate Display */}
        <View style={styles.hrSection}>
          <View style={styles.avgHRContainer}>
            <Text style={styles.label}>Average Heart Rate</Text>
            <HeartRateDisplay 
              bpm={workout.avgHeartRate} 
              maxHeartRate={user.maxHeartRate}
              size="large"
            />
          </View>
        </View>

        {/* Workout Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Details</Text>
          
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="calendar" size={20} color="#FF6B6B" />
                <Text style={styles.detailLabel}>Date</Text>
              </View>
              <Text style={styles.detailValue}>{workout.date}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="activity" size={20} color="#FF6B6B" />
                <Text style={styles.detailLabel}>Type</Text>
              </View>
              <Text style={styles.detailValue}>
                {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="trending-up" size={20} color="#FF6B6B" />
                <Text style={styles.detailLabel}>Intensity</Text>
              </View>
              <Text style={styles.detailValue}>
                {workout.intensity.charAt(0).toUpperCase() + workout.intensity.slice(1)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="time" size={20} color="#FF6B6B" />
                <Text style={styles.detailLabel}>Duration</Text>
              </View>
              <Text style={styles.detailValue}>{formatDuration(workout.duration)}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="location" size={20} color="#FF6B6B" />
                <Text style={styles.detailLabel}>Distance</Text>
              </View>
              <Text style={styles.detailValue}>{workout.distance.toFixed(2)} km</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="flame" size={20} color="#FF6B6B" />
                <Text style={styles.detailLabel}>Calories</Text>
              </View>
              <Text style={styles.detailValue}>{workout.caloriesBurned} kcal</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons name="heart" size={20} color="#FF6B6B" />
                <Text style={styles.detailLabel}>Max Heart Rate</Text>
              </View>
              <Text style={styles.detailValue}>{workout.maxHeartRate} bpm</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {workout.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{workout.notes}</Text>
            </View>
          </View>
        )}

        {/* Stats Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{(workout.distance / workout.duration * 3600).toFixed(1)}</Text>
              <Text style={styles.statLabel}>km/h</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {((workout.caloriesBurned / workout.duration) * 60).toFixed(0)}
              </Text>
              <Text style={styles.statLabel}>kcal/hr</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{workout.maxHeartRate - workout.avgHeartRate}</Text>
              <Text style={styles.statLabel}>bpm diff</Text>
            </View>
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
  hrSection: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avgHRContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
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
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  notesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  notesText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
