import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserProfile, WorkoutSession } from '../types/cardio';

interface WorkoutScreenProps {
  profile: UserProfile;
  onWorkoutComplete: (workout: WorkoutSession) => Promise<void>;
}

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export default function WorkoutScreen({ profile, onWorkoutComplete }: WorkoutScreenProps) {
  const [running, setRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentHeartRate, setCurrentHeartRate] = useState(profile.targetHeartRateMin);
  const [heartRateReadings, setHeartRateReadings] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready to train.');
  const startAtRef = useRef<Date | null>(null);

  useEffect(() => {
    if (!running) {
      return;
    }

    const id = setInterval(() => {
      setElapsedSeconds((seconds) => {
        const nextSeconds = seconds + 1;
        const zoneMidpoint = (profile.targetHeartRateMin + profile.targetHeartRateMax) / 2;
        const amplitude = Math.max(8, Math.round((profile.targetHeartRateMax - profile.targetHeartRateMin) / 2));
        const nextHeartRate = Math.round(zoneMidpoint + Math.sin(nextSeconds / 2.2) * amplitude);
        const bounded = Math.max(profile.targetHeartRateMin - 20, Math.min(profile.targetHeartRateMax + 12, nextHeartRate));
        setCurrentHeartRate(bounded);
        setHeartRateReadings((readings) => [...readings.slice(-179), bounded]);
        return nextSeconds;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [profile.targetHeartRateMax, profile.targetHeartRateMin, running]);

  const avgHeartRate = useMemo(() => {
    if (heartRateReadings.length === 0) {
      return currentHeartRate;
    }

    return Math.round(heartRateReadings.reduce((sum, value) => sum + value, 0) / heartRateReadings.length);
  }, [currentHeartRate, heartRateReadings]);

  const startWorkout = () => {
    setRunning(true);
    setElapsedSeconds(0);
    setHeartRateReadings([]);
    setCurrentHeartRate(profile.targetHeartRateMin + 8);
    setStatusMessage('Workout running...');
    startAtRef.current = new Date();
  };

  const stopWorkout = async () => {
    if (!startAtRef.current || elapsedSeconds < 10) {
      setRunning(false);
      setStatusMessage('Workout discarded: sessions under 10 seconds are not saved.');
      return;
    }

    setSaving(true);
    setRunning(false);

    const endTime = new Date();
    const maxHeartRate = heartRateReadings.length > 0 ? Math.max(...heartRateReadings) : currentHeartRate;

    const workout: WorkoutSession = {
      id: `${endTime.getTime()}`,
      startTime: startAtRef.current.toISOString(),
      endTime: endTime.toISOString(),
      durationSeconds: elapsedSeconds,
      avgHeartRate,
      maxHeartRate,
      calories: Math.round((elapsedSeconds / 60) * (profile.weightKg * 0.12)),
    };

    await onWorkoutComplete(workout);
    setStatusMessage('Workout saved successfully.');
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Tracker</Text>
      <Text style={styles.subtitle}>Start a cardio session and monitor your heart rate in real time.</Text>

      <View style={styles.timerCard}>
        <Text style={styles.timerLabel}>Session Timer</Text>
        <Text style={styles.timerValue}>{formatTime(elapsedSeconds)}</Text>
      </View>

      <View style={styles.hrCard}>
        <Text style={styles.hrLabel}>Current Heart Rate</Text>
        <Text style={styles.hrValue}>{currentHeartRate} BPM</Text>
        <Text style={styles.hrMeta}>Average: {avgHeartRate} BPM · Target: {profile.targetHeartRateMin}-{profile.targetHeartRateMax}</Text>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, running ? styles.stopButton : styles.startButton]}
        onPress={running ? stopWorkout : startWorkout}
        disabled={saving}
      >
        <Text style={styles.buttonText}>{running ? 'Stop Workout' : 'Start Workout'}</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Sessions shorter than 10 seconds are ignored to keep analytics clean.
      </Text>
      <Text style={styles.statusText}>{statusMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 6,
    color: '#64748b',
    lineHeight: 20,
  },
  timerCard: {
    marginTop: 22,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
  },
  timerLabel: {
    color: '#64748b',
    fontSize: 14,
  },
  timerValue: {
    marginTop: 8,
    fontSize: 44,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: 1,
  },
  hrCard: {
    marginTop: 12,
    borderRadius: 18,
    padding: 18,
    backgroundColor: '#fee2e2',
  },
  hrLabel: {
    color: '#b91c1c',
    fontWeight: '600',
  },
  hrValue: {
    marginTop: 8,
    fontSize: 36,
    fontWeight: '700',
    color: '#b91c1c',
  },
  hrMeta: {
    marginTop: 8,
    color: '#7f1d1d',
    fontSize: 13,
  },
  primaryButton: {
    marginTop: 24,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#16a34a',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  hint: {
    marginTop: 14,
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
  },
  statusText: {
    marginTop: 10,
    color: '#0f172a',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
});
