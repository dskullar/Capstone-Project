import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export default function LogLiftScreen({ navigation }: any) {
  const [exerciseName, setExerciseName] = useState<string>('');
  const [sets, setSets] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Add exercise to the list
  const addExercise = () => {
    if (exerciseName && sets && reps && weight) {
      const newExercise: Exercise = {
        name: exerciseName,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: parseFloat(weight),
      };
      setExercises([...exercises, newExercise]);
      setExerciseName('');
      setSets('');
      setReps('');
      setWeight('');
    }
  };

  // Save workout and go back
  const saveWorkout = () => {
    // Save the workout logic here (e.g., save to state or database)
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Log Your Workout</Text>

      {/* Input fields for each exercise */}
      <TextInput
        style={styles.input}
        placeholder="Exercise (e.g., Bench Press)"
        value={exerciseName}
        onChangeText={setExerciseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Sets"
        value={sets}
        keyboardType="numeric"
        onChangeText={setSets}
      />
      <TextInput
        style={styles.input}
        placeholder="Reps"
        value={reps}
        keyboardType="numeric"
        onChangeText={setReps}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight"
        value={weight}
        keyboardType="numeric"
        onChangeText={setWeight}
      />
      <Button title="Add Exercise" onPress={addExercise} />

      {/* List of added exercises */}
      <FlatList
        data={exercises}
        renderItem={({ item }) => (
          <View style={styles.exerciseContainer}>
            <Text style={styles.exerciseText}>
              {item.name}: {item.sets} sets x {item.reps} reps @ {item.weight} kg
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Save workout button */}
      {exercises.length > 0 && (
        <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
          <Text style={styles.saveButtonText}>Save Workout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  exerciseContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: '100%',
  },
  exerciseText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
  },
  saveButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
