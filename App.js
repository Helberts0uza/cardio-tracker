import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import StatsScreen from './screens/StatsScreen';
import PlanoScreen from './screens/PlanoScreen';
import ClockScreen from './screens/ClockScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const data = await AsyncStorage.getItem('cardio_data');
        if (!data) {
          await AsyncStorage.setItem('cardio_data', JSON.stringify({
            workouts: [],
            plano: {
              dias: {
                seg: { exercicios: [], feito: false },
                ter: { exercicios: [], feito: false },
                qua: { exercicios: [], feito: false },
                qui: { exercicios: [], feito: false },
                sex: { exercicios: [], feito: false },
                sab: { exercicios: [], feito: false },
                dom: { exercicios: [], feito: false }
              }
            }
          }));
        }
      } catch (error) {
        console.error('Erro ao inicializar app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Stats') {
              iconName = focused ? 'chart-line' : 'chart-line';
            } else if (route.name === 'Plano') {
              iconName = focused ? 'dumbbell' : 'dumbbell';
            } else if (route.name === 'Clock') {
              iconName = focused ? 'clock-digital' : 'clock-outline';
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF6B6B',
          tabBarInactiveTintColor: '#999',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#eee',
            borderTopWidth: 1,
          }
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Hoje' }}
        />
        <Tab.Screen 
          name="Plano" 
          component={PlanoScreen}
          options={{ title: 'Plano' }}
        />
        <Tab.Screen 
          name="Clock" 
          component={ClockScreen}
          options={{ title: 'Relógio' }}
        />
        <Tab.Screen 
          name="History" 
          component={HistoryScreen}
          options={{ title: 'Histórico' }}
        />
        <Tab.Screen 
          name="Stats" 
          component={StatsScreen}
          options={{ title: 'Estatísticas' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
