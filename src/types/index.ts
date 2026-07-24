export interface User {
  id: string;
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female';
  maxHeartRate: number;
  createdAt: string;
}

export interface Workout {
  id: string;
  date: string;
  duration: number; // seconds
  distance: number; // km
  avgHeartRate: number;
  maxHeartRate: number;
  caloriesBurned: number;
  notes: string;
  type: 'running' | 'cycling' | 'walking' | 'cardio' | 'other';
  intensity: 'low' | 'moderate' | 'high';
  createdAt: string;
}

export interface HeartRateZone {
  name: string;
  color: string;
  minBpm: number;
  maxBpm: number;
  description: string;
}

export interface DailyStats {
  date: string;
  workouts: number;
  totalDuration: number;
  totalDistance: number;
  totalCalories: number;
  avgHeartRate: number;
}
