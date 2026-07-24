import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { UserProfile } from '../types/cardio';

interface ProfileScreenProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => Promise<void>;
}

export default function ProfileScreen({ profile, onSave }: ProfileScreenProps) {
  const [form, setForm] = useState<UserProfile>(profile);
  const [saving, setSaving] = useState(false);

  const updateField = (field: keyof UserProfile, value: string) => {
    if (field === 'name') {
      setForm((current) => ({ ...current, [field]: value }));
      return;
    }

    const digitsOnly = value.replace(/[^0-9]/g, '');
    const numericValue = digitsOnly.length === 0 ? 0 : Number(digitsOnly);
    setForm((current) => ({
      ...current,
      [field]: numericValue,
    }));
  };

  const save = async () => {
    setSaving(true);
    const normalized = {
      ...form,
      name: form.name.trim() || 'Athlete',
      age: Math.max(12, form.age),
      weightKg: Math.max(35, form.weightKg),
      weeklyGoalMinutes: Math.max(30, form.weeklyGoalMinutes),
      targetHeartRateMin: Math.max(80, form.targetHeartRateMin),
      targetHeartRateMax: Math.max(form.targetHeartRateMin + 5, form.targetHeartRateMax),
    };

    setForm(normalized);
    await onSave(normalized);
    setSaving(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Manage your targets and personal data.</Text>

      <View style={styles.formCard}>
        <Field label="Name" value={form.name} onChangeText={(value) => updateField('name', value)} />
        <Field label="Age" value={`${form.age || ''}`} keyboardType="numeric" onChangeText={(value) => updateField('age', value)} />
        <Field label="Weight (kg)" value={`${form.weightKg || ''}`} keyboardType="numeric" onChangeText={(value) => updateField('weightKg', value)} />
        <Field label="Weekly goal (min)" value={`${form.weeklyGoalMinutes || ''}`} keyboardType="numeric" onChangeText={(value) => updateField('weeklyGoalMinutes', value)} />
        <Field label="Target HR min" value={`${form.targetHeartRateMin || ''}`} keyboardType="numeric" onChangeText={(value) => updateField('targetHeartRateMin', value)} />
        <Field label="Target HR max" value={`${form.targetHeartRateMax || ''}`} keyboardType="numeric" onChangeText={(value) => updateField('targetHeartRateMax', value)} />

        <TouchableOpacity style={styles.saveButton} onPress={save} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'numeric';
}

function Field({ label, value, onChangeText, keyboardType = 'default' }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={styles.input}
        placeholder={label}
        placeholderTextColor="#94a3b8"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 18,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 6,
    color: '#64748b',
  },
  formCard: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    color: '#334155',
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0f172a',
    backgroundColor: '#fff',
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
