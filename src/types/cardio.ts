export interface WorkoutSession {
  id: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  avgHeartRate: number;
  maxHeartRate: number;
  calories: number;
}

export interface UserProfile {
  name: string;
  age: number;
  weightKg: number;
  weeklyGoalMinutes: number;
  targetHeartRateMin: number;
  targetHeartRateMax: number;
}

export interface CardioData {
  workouts: WorkoutSession[];
  profile: UserProfile;
}
