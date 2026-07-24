# Cardio Tracker

A production-ready **React Native + Expo** cardio tracking app with TypeScript support for web and mobile.

## Features

- Dashboard with live heart rate preview and workout summary stats
- Start/Stop workout tracking with timer and heart-rate simulation
- Weekly and monthly analytics charts
- Editable user profile with training targets
- Persistent local storage with AsyncStorage
- Seeded mock data for quick testing
- Modern responsive UI and bottom-tab navigation

## Tech Stack

- Expo SDK 51
- React Native + TypeScript
- React Navigation (bottom tabs)
- AsyncStorage
- react-native-chart-kit + react-native-svg

## Getting Started

```bash
npm install
npm run typecheck
npm run web
```

For device testing:

```bash
npm start
npm run android
npm run ios
```

## App Structure

- `/App.tsx` - app bootstrap + navigation
- `/src/screens` - Dashboard, Workout, Analytics, Profile
- `/src/storage/cardioStorage.ts` - local persistence and mock seed data
- `/src/types/cardio.ts` - domain models
- `/src/components/StatCard.tsx` - reusable UI card

## Data Model

Data is stored under `cardio_tracker_v1`:

- `profile`: name, age, weight, weekly goal, HR zone
- `workouts`: start/end time, duration, avg/max HR, calories

## Notes

- Workouts under 10 seconds are ignored to avoid noisy analytics.
- The app is ready to run on Expo web and mobile targets.
