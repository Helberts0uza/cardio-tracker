import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './src/screens/HomeScreen';
import WorkoutsScreen from './src/screens/WorkoutsScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import WorkoutDetailScreen from './src/screens/WorkoutDetailScreen';
import { initializeSampleData } from './src/data/sampleData';
import { WorkoutProvider } from './src/context/WorkoutContext';
import { UserProvider } from './src/context/UserContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'WorkoutsTab') {
            iconName = focused ? 'pulse' : 'pulse-outline';
          } else if (route.name === 'AnalyticsTab') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#888',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#F8F9FA',
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: '#000',
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          title: 'Dashboard',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="WorkoutsTab" 
        component={WorkoutsScreen}
        options={{
          title: 'Workouts',
        }}
      />
      <Tab.Screen 
        name="AnalyticsTab" 
        component={AnalyticsScreen}
        options={{
          title: 'Analytics',
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeSampleData();
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <UserProvider>
      <WorkoutProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="MainTabs" component={HomeTabs} />
            <Stack.Screen 
              name="WorkoutDetail" 
              component={WorkoutDetailScreen}
              options={{
                presentation: 'modal',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </WorkoutProvider>
    </UserProvider>
  );
}
