import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function HistoryScreen() {
  const workoutHistory = [
    {
      week: 1,
      exercises: [
        { name: 'Bench Press', sets: 3, reps: 10, weight: 80 },
        { name: 'Squats', sets: 4, reps: 12, weight: 100 },
      ],
    },
    {
      week: 2,
      exercises: [
        { name: 'Deadlift', sets: 3, reps: 8, weight: 120 },
        { name: 'Overhead Press', sets: 4, reps: 10, weight: 60 },
      ],
    },
    // Example data for the workout history
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workout History</Text>
      <FlatList
        data={workoutHistory}
        renderItem={({ item }) => (
          <View style={styles.historyContainer}>
            <Text style={styles.weekText}>Week {item.week}</Text>
            {item.exercises.map((exercise, index) => (
              <Text key={index} style={styles.exerciseText}>
                {exercise.name}: {exercise.sets} sets x {exercise.reps} reps @ {exercise.weight} kg
              </Text>
            ))}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  historyContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  weekText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseText: {
    fontSize: 16,
    color: '#333',
  },
});
