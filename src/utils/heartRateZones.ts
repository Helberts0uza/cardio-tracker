import { HeartRateZone } from '../types';

export function getHeartRateZones(maxHeartRate: number): HeartRateZone[] {
  return [
    {
      name: 'Rest',
      color: '#4CAF50',
      minBpm: 0,
      maxBpm: Math.round(maxHeartRate * 0.5),
      description: 'Very light activity'
    },
    {
      name: 'Warm-up',
      color: '#8BC34A',
      minBpm: Math.round(maxHeartRate * 0.5) + 1,
      maxBpm: Math.round(maxHeartRate * 0.6),
      description: 'Light activity'
    },
    {
      name: 'Fat Burn',
      color: '#FFC107',
      minBpm: Math.round(maxHeartRate * 0.6) + 1,
      maxBpm: Math.round(maxHeartRate * 0.7),
      description: 'Moderate intensity'
    },
    {
      name: 'Cardio',
      color: '#FF9800',
      minBpm: Math.round(maxHeartRate * 0.7) + 1,
      maxBpm: Math.round(maxHeartRate * 0.85),
      description: 'High intensity'
    },
    {
      name: 'Peak',
      color: '#F44336',
      minBpm: Math.round(maxHeartRate * 0.85) + 1,
      maxBpm: maxHeartRate,
      description: 'Maximum effort'
    }
  ];
}

export function getCurrentZone(bpm: number, maxHeartRate: number): HeartRateZone | null {
  const zones = getHeartRateZones(maxHeartRate);
  return zones.find(z => bpm >= z.minBpm && bpm <= z.maxBpm) || null;
}

export function getHeartRatePercentage(bpm: number, maxHeartRate: number): number {
  return Math.min(100, Math.round((bpm / maxHeartRate) * 100));
}
