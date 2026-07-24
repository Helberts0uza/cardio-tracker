import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import DashboardScreen from './src/screens/DashboardScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { CardioData, WorkoutSession, UserProfile } from './src/types/cardio';
import { loadCardioData, saveCardioData } from './src/storage/cardioStorage';

const Tab = createBottomTabNavigator();

export default function App() {
  const [data, setData] = useState<CardioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const loadedData = await loadCardioData();
      setData(loadedData);
      setLoading(false);
    };

    bootstrap();
  }, []);

  const handleWorkoutComplete = async (workout: WorkoutSession) => {
    if (!data) {
      return;
    }

    const nextData: CardioData = {
      ...data,
      workouts: [workout, ...data.workouts],
    };

    setData(nextData);
    await saveCardioData(nextData);
  };

  const handleProfileSave = async (profile: UserProfile) => {
    if (!data) {
      return;
    }

    const nextData: CardioData = {
      ...data,
      profile,
    };

    setData(nextData);
    await saveCardioData(nextData);
  };

  if (loading || !data) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ef4444" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#ef4444',
          tabBarInactiveTintColor: '#64748b',
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ color, size }) => {
            const iconMap: Record<string, string> = {
              Dashboard: 'heart-pulse',
              Workout: 'run-fast',
              Analytics: 'chart-line',
              Profile: 'account-circle',
            };

            return (
              <MaterialCommunityIcons
                name={iconMap[route.name] as keyof typeof MaterialCommunityIcons.glyphMap}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen name="Dashboard">
          {() => <DashboardScreen workouts={data.workouts} profile={data.profile} />}
        </Tab.Screen>
        <Tab.Screen name="Workout">
          {() => <WorkoutScreen profile={data.profile} onWorkoutComplete={handleWorkoutComplete} />}
        </Tab.Screen>
        <Tab.Screen name="Analytics">
          {() => <AnalyticsScreen workouts={data.workouts} />}
        </Tab.Screen>
        <Tab.Screen name="Profile">
          {() => <ProfileScreen profile={data.profile} onSave={handleProfileSave} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f8fafc',
  },
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  tabBar: {
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
});
