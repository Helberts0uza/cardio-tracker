import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { calculateMaxHeartRate } from '../utils/calculations';

export default function ProfileScreen() {
  const { user, updateUser, loading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user || {});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.name || !formData.age || !formData.weight || !formData.height) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSaving(true);
    const maxHR = calculateMaxHeartRate(parseInt(formData.age), formData.gender);
    const updatedUser = {
      ...formData,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseInt(formData.height),
      maxHeartRate: maxHR,
    };
    await updateUser(updatedUser);
    setSaving(false);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated!');
  };

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="#FF6B6B" />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{formData.name}</Text>
            <Text style={styles.email}>{formData.age} years old</Text>
          </View>
          {!isEditing && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          {isEditing ? (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Name"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Age</Text>
                  <TextInput
                    style={styles.input}
                    value={String(formData.age)}
                    onChangeText={(text) => setFormData({ ...formData, age: text })}
                    placeholder="Age"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.genderContainer}>
                    <TouchableOpacity
                      style={[
                        styles.genderButton,
                        formData.gender === 'male' && styles.genderButtonActive,
                      ]}
                      onPress={() => setFormData({ ...formData, gender: 'male' })}
                    >
                      <Text style={styles.genderButtonText}>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.genderButton,
                        formData.gender === 'female' && styles.genderButtonActive,
                      ]}
                      onPress={() => setFormData({ ...formData, gender: 'female' })}
                    >
                      <Text style={styles.genderButtonText}>Female</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={String(formData.weight)}
                    onChangeText={(text) => setFormData({ ...formData, weight: text })}
                    placeholder="Weight"
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Height (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={String(formData.height)}
                    onChangeText={(text) => setFormData({ ...formData, height: text })}
                    placeholder="Height"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setFormData(user);
                    setIsEditing(false);
                  }}
                  disabled={saving}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Age</Text>
                  <Text style={styles.infoValue}>{formData.age} years</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Gender</Text>
                  <Text style={styles.infoValue}>
                    {formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Weight</Text>
                  <Text style={styles.infoValue}>{formData.weight} kg</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Height</Text>
                  <Text style={styles.infoValue}>{formData.height} cm</Text>
                </View>
                <View style={[styles.infoRow, styles.infoRowBorder]}>
                  <Text style={styles.infoLabel}>Max Heart Rate</Text>
                  <Text style={styles.infoValue}>{formData.maxHeartRate} bpm</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>Cardio Tracker v1.0.0</Text>
            <Text style={styles.aboutSubtext}>Track your fitness journey</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFE0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  email: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  editButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoRowBorder: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  aboutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  aboutSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
