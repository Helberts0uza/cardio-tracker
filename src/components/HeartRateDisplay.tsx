import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentZone } from '../utils/heartRateZones';

interface HeartRateDisplayProps {
  bpm: number;
  maxHeartRate: number;
  size?: 'small' | 'large';
}

export default function HeartRateDisplay({ bpm, maxHeartRate, size = 'large' }: HeartRateDisplayProps) {
  const currentZone = getCurrentZone(bpm, maxHeartRate);
  
  if (size === 'small') {
    return (
      <View style={styles.smallContainer}>
        <Ionicons name="heart" size={24} color={currentZone?.color || '#999'} />
        <Text style={styles.smallText}>{bpm} BPM</Text>
        <Text style={styles.smallZone}>{currentZone?.name || 'N/A'}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.largeContainer}>
      <View style={[styles.circle, { borderColor: currentZone?.color || '#999' }]}>
        <Ionicons name="heart" size={60} color={currentZone?.color || '#999'} />
        <Text style={styles.bpm}>{bpm}</Text>
        <Text style={styles.unit}>BPM</Text>
      </View>
      <Text style={styles.zoneName}>{currentZone?.name || 'N/A'}</Text>
      <Text style={styles.zoneDescription}>{currentZone?.description || ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  smallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  smallZone: {
    fontSize: 12,
    color: '#666',
  },
  largeContainer: {
    alignItems: 'center',
    gap: 12,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  bpm: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  unit: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  zoneName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 12,
  },
  zoneDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
