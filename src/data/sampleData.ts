import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Workout } from '../types';

const defaultUser: User = {
  id: '1',
  name: 'John Doe',
  age: 30,
  weight: 75,
  height: 180,
  gender: 'male',
  maxHeartRate: 190,
  createdAt: new Date().toISOString(),
};

function generateSampleWorkouts(): Workout[] {
  const workouts: Workout[] = [];
  const today = new Date();
  
  // Generate 14 days of sample workouts
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // 70% chance of having a workout
    if (Math.random() > 0.3) {
      const types: Array<'running' | 'cycling' | 'walking' | 'cardio' | 'other'> = 
        ['running', 'cycling', 'walking', 'cardio', 'other'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const duration = Math.floor(Math.random() * 3600) + 600; // 10-70 minutes
      const distance = Math.round((duration / 60 / 10) * 10) / 10; // Roughly 10 km/hour
      const avgHeartRate = Math.floor(Math.random() * 60) + 100; // 100-160 bpm
      const maxHeartRate = avgHeartRate + Math.floor(Math.random() * 40);
      
      workouts.push({
        id: `workout_${i}_${Math.random()}`,
        date: dateStr,
        duration,
        distance,
        avgHeartRate,
        maxHeartRate,
        caloriesBurned: Math.floor(avgHeartRate * (duration / 60) * 0.1),
        notes: `${type.charAt(0).toUpperCase() + type.slice(1)} session`,
        type,
        intensity: avgHeartRate > 140 ? 'high' : avgHeartRate > 120 ? 'moderate' : 'low',
        createdAt: new Date().toISOString(),
      });
    }
  }
  
  return workouts;
}

export async function initializeSampleData() {
  try {
    const existingUser = await AsyncStorage.getItem('user');
    const existingWorkouts = await AsyncStorage.getItem('workouts');
    
    if (!existingUser) {
      await AsyncStorage.setItem('user', JSON.stringify(defaultUser));
    }
    
    if (!existingWorkouts) {
      const sampleWorkouts = generateSampleWorkouts();
      await AsyncStorage.setItem('workouts', JSON.stringify(sampleWorkouts));
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
}
