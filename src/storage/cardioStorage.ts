import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardioData, WorkoutSession } from '../types/cardio';

const STORAGE_KEY = 'cardio_tracker_v1';

const defaultProfile = {
  name: 'Athlete',
  age: 28,
  weightKg: 72,
  weeklyGoalMinutes: 150,
  targetHeartRateMin: 120,
  targetHeartRateMax: 165,
};

const randomWorkout = (daysAgo: number): WorkoutSession => {
  const end = new Date();
  end.setDate(end.getDate() - daysAgo);
  end.setHours(7 + (daysAgo % 4), 30, 0, 0);

  const durationSeconds = 1200 + (daysAgo % 6) * 300;
  const avgHeartRate = 125 + (daysAgo % 8) * 4;

  const start = new Date(end.getTime() - durationSeconds * 1000);

  return {
    id: `${end.getTime()}-${daysAgo}`,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    durationSeconds,
    avgHeartRate,
    maxHeartRate: avgHeartRate + 18,
    calories: Math.round((durationSeconds / 60) * 8.5),
  };
};

const createMockData = (): CardioData => ({
  profile: defaultProfile,
  workouts: [1, 2, 3, 5, 7, 9, 11, 14, 17, 20].map(randomWorkout),
});

export const loadCardioData = async (): Promise<CardioData> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as CardioData;
    }

    const mockData = createMockData();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    return mockData;
  } catch {
    return createMockData();
  }
};

export const saveCardioData = async (data: CardioData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save cardio data', error);
    throw error;
  }
};
