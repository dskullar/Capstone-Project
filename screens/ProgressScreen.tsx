import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { firestore } from '../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

const ProgressScreen = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [exerciseList, setExerciseList] = useState<any[]>([]); // Store exercises with sets
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]); // Selected exercises to compare
  const [progressData, setProgressData] = useState<any[]>([]); // Store progress data for comparison

  // Fetch all exercises for the selected date range
  useEffect(() => {
    if (startDate && endDate) {
      fetchExercisesForDateRange();
    }
  }, [startDate, endDate]);

  const fetchExercisesForDateRange = async () => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        const sessionsRef = collection(firestore, 'lifts', user.uid, 'sessions');
        const q = query(sessionsRef, where('date', '>=', startDate), where('date', '<=', endDate));
        const querySnapshot = await getDocs(q);

        const exercises: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data.exercises.forEach((exercise: any) => {
            if (!exercises.some((e) => e.exercise === exercise.exercise)) {
              exercises.push({
                exercise: exercise.exercise,
                sets: exercise.sets,
              });
            }
          });
        });

        setExerciseList(exercises);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const handleExerciseSelect = (exercise: string) => {
    setSelectedExercises((prevExercises) => {
      if (prevExercises.includes(exercise)) {
        return prevExercises.filter((ex) => ex !== exercise);
      } else {
        return [...prevExercises, exercise];
      }
    });
  };

  const handleCompare = async () => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        const sessionsRef = collection(firestore, 'lifts', user.uid, 'sessions');
        const q = query(sessionsRef, where('date', '>=', startDate), where('date', '<=', endDate));
        const querySnapshot = await getDocs(q);

        const sessionsData: any[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const weekData = {
            week: data.date,
            exercises: data.exercises.filter((exercise: any) =>
              selectedExercises.includes(exercise.exercise)
            ),
          };
          sessionsData.push(weekData);
        });

        setProgressData(sessionsData);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Compare Your Progress</Text>

      {/* Start Date */}
      <TextInput
        placeholder="Start Date (MM/DD/YY)"
        value={startDate}
        onChangeText={setStartDate}
        style={styles.input}
      />

      {/* End Date */}
      <TextInput
        placeholder="End Date (MM/DD/YY)"
        value={endDate}
        onChangeText={setEndDate}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={fetchExercisesForDateRange}>
        <Text style={styles.buttonText}>Fetch Exercises</Text>
      </TouchableOpacity>

      {/* Display fetched exercises */}
      <Text style={styles.subtitle}>Select Exercises to Compare</Text>
      {exerciseList.length > 0 ? (
        exerciseList.map((item, index) => (
          <View key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseText}>{item.exercise}</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => handleExerciseSelect(item.exercise)}>
              <Text style={styles.buttonText}>Select</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No exercises available for selected dates.</Text>
      )}

      {/* Button to compare progress */}
      <TouchableOpacity style={styles.button} onPress={handleCompare}>
        <Text style={styles.buttonText}>Compare Progress</Text>
      </TouchableOpacity>

      {/* If there is any progress data, display the results */}
      {progressData.length > 0 && (
        <View style={styles.progressDataContainer}>
          <Text style={styles.subtitle}>Progress Data:</Text>
          {progressData.map((weekData, index) => (
            <View key={index} style={styles.weekData}>
              <Text style={styles.weekText}>Week: {weekData.week}</Text>
              {weekData.exercises.map((exerciseData: any, idx: number) => (
                <View key={idx} style={styles.exerciseDetails}>
                  <Text style={styles.exerciseText}>{exerciseData.exercise}</Text>
                  {exerciseData.sets.map((set: any, setIndex: number) => (
                    <Text key={setIndex} style={styles.setDetails}>
                      Reps: {set.reps}, Weight: {set.weight} lbs
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  exerciseText: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  progressDataContainer: {
    marginTop: 20,
  },
  weekData: {
    marginBottom: 20,
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 5,
  },
  weekText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  exerciseDetails: {
    marginLeft: 20,
  },
  setDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default ProgressScreen;
