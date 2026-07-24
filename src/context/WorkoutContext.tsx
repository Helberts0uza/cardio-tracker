import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '../types';

interface WorkoutContextType {
  workouts: Workout[];
  addWorkout: (workout: Workout) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  updateWorkout: (workout: Workout) => Promise<void>;
  getWorkoutById: (id: string) => Workout | undefined;
  loading: boolean;
}

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const data = await AsyncStorage.getItem('workouts');
      if (data) {
        setWorkouts(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWorkout = async (workout: Workout) => {
    try {
      const updatedWorkouts = [workout, ...workouts];
      await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      setWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      const updatedWorkouts = workouts.filter(w => w.id !== id);
      await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      setWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const updateWorkout = async (workout: Workout) => {
    try {
      const updatedWorkouts = workouts.map(w => w.id === workout.id ? workout : w);
      await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      setWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  const getWorkoutById = (id: string) => {
    return workouts.find(w => w.id === id);
  };

  return (
    <WorkoutContext.Provider 
      value={{ workouts, addWorkout, deleteWorkout, updateWorkout, getWorkoutById, loading }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = React.useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within WorkoutProvider');
  }
  return context;
}
