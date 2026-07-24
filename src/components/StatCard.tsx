import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
  label: string;
  value: string;
  accent?: string;
}

export default function StatCard({ label, value, accent = '#ef4444' }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    minHeight: 96,
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  label: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
  },
});
