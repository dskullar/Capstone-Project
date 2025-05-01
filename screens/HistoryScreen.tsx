import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { firestore } from '../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface Set {
  reps: string;
  weight: string;
}

interface ExerciseData {
  exercise: string;
  sets: Set[];
}

const HistoryScreen = () => {
  const [loggedDates, setLoggedDates] = useState<string[]>([]); // List of logged dates
  const [selectedDate, setSelectedDate] = useState<string>(''); // Currently selected date
  const [exerciseData, setExerciseData] = useState<ExerciseData[]>([]); // Exercise data for the selected date

  useEffect(() => {
    fetchLoggedDates();
  }, []);

  const fetchLoggedDates = async () => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        const sessionsRef = collection(firestore, 'lifts', user.uid, 'sessions');
        const q = query(sessionsRef);
        const querySnapshot = await getDocs(q);

        const dates: string[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const sessionDate = data.date;
          if (!dates.includes(sessionDate)) {
            dates.push(sessionDate);
          }
        });

        setLoggedDates(dates);
      }
    } catch (error) {
      console.error('Error fetching logged dates:', error);
    }
  };

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    fetchExercisesForDate(date);
  };

  const fetchExercisesForDate = async (date: string) => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        const sessionsRef = collection(firestore, 'lifts', user.uid, 'sessions');
        const q = query(sessionsRef, where('date', '==', date));
        const querySnapshot = await getDocs(q);

        const exercises: ExerciseData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data.exercises.forEach((exercise: any) => {
            exercises.push({
              exercise: exercise.exercise,
              sets: exercise.sets,
            });
          });
        });

        setExerciseData(exercises);
      }
    } catch (error) {
      console.error('Error fetching exercise data for selected date:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Workout History</Text>

      {/* Display logged dates */}
      {loggedDates.length > 0 ? (
        <View>
          <Text style={styles.subtitle}>Select a Date:</Text>
          {loggedDates.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dateButton}
              onPress={() => handleDateSelect(date)}>
              <Text style={styles.dateButtonText}>{date}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.noDataText}>No workout sessions logged yet.</Text>
      )}

      {/* Display exercises for the selected date */}
      {selectedDate && exerciseData.length > 0 && (
        <View style={styles.exerciseList}>
          <Text style={styles.subtitle}>Exercises on {selectedDate}:</Text>
          {exerciseData.map((item, index) => (
            <View key={index} style={styles.exerciseCard}>
              <Text style={styles.exerciseText}>{item.exercise}</Text>
              {item.sets.map((set: Set, setIndex: number) => (
                <Text key={setIndex} style={styles.setDetails}>
                  Reps: {set.reps}, Weight: {set.weight} lbs
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* If no exercises are available for the selected date */}
      {selectedDate && exerciseData.length === 0 && (
        <Text style={styles.noDataText}>No exercises found for this date.</Text>
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
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  exerciseList: {
    marginTop: 20,
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
  setDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});

export default HistoryScreen;
