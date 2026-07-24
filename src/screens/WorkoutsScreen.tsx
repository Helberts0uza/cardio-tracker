import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkout } from '../context/WorkoutContext';
import { formatDuration } from '../utils/calculations';

export default function WorkoutsScreen({ navigation }: any) {
  const { workouts, deleteWorkout, loading } = useWorkout();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = (workoutId: string) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            setDeleteLoading(true);
            await deleteWorkout(workoutId);
            setDeleteLoading(false);
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const renderWorkout = ({ item }: any) => (
    <TouchableOpacity
      style={styles.workoutItem}
      onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item.id })}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconBg, { backgroundColor: getTypeColor(item.type) + '20' }]}>
          <Ionicons
            name={getTypeIcon(item.type)}
            size={28}
            color={getTypeColor(item.type)}
          />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemType}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
          <Text style={styles.itemDate}>{item.date}</Text>
          <Text style={styles.itemIntensity}>
            {item.intensity.charAt(0).toUpperCase() + item.intensity.slice(1)} intensity
          </Text>
        </View>
      </View>
      <View style={styles.itemRight}>
        <View style={styles.itemStat}>
          <Text style={styles.itemStatLabel}>Duration</Text>
          <Text style={styles.itemStatValue}>{formatDuration(item.duration)}</Text>
        </View>
        <View style={styles.itemStat}>
          <Text style={styles.itemStatLabel}>HR</Text>
          <Text style={styles.itemStatValue}>{item.avgHeartRate}bpm</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item.id)}
        disabled={deleteLoading}
      >
        <Ionicons name="trash" size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {sortedWorkouts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="pulse" size={64} color="#ddd" />
          <Text style={styles.emptyText}>No workouts yet</Text>
          <Text style={styles.emptySubtext}>Start tracking your workouts!</Text>
        </View>
      ) : (
        <FlatList
          data={sortedWorkouts}
          renderItem={renderWorkout}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

function getTypeIcon(type: string): any {
  switch (type) {
    case 'running': return 'walk';
    case 'cycling': return 'bicycle';
    case 'walking': return 'walk-outline';
    case 'cardio': return 'pulse';
    default: return 'activity';
  }
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'running': return '#FF6B6B';
    case 'cycling': return '#2196F3';
    case 'walking': return '#4CAF50';
    case 'cardio': return '#FF9800';
    default: return '#999';
  }
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
  list: {
    padding: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  workoutItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  itemIntensity: {
    fontSize: 11,
    color: '#ccc',
    marginTop: 2,
  },
  itemRight: {
    marginRight: 8,
  },
  itemStat: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  itemStatLabel: {
    fontSize: 10,
    color: '#999',
  },
  itemStatValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginTop: 1,
  },
  deleteBtn: {
    padding: 8,
  },
});
