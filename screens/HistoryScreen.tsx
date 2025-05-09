import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
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
  const [loggedDates, setLoggedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [exerciseData, setExerciseData] = useState<ExerciseData[]>([]);

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

        setLoggedDates(dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()));
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
            exercises.push({ exercise: exercise.exercise, sets: exercise.sets });
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
      <Text style={styles.header}>Workout History</Text>

      {loggedDates.length > 0 ? (
        <View>
          <Text style={styles.subtitle}>Select a Date:</Text>
          {loggedDates.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateButton,
                selectedDate === date && styles.dateButtonSelected,
              ]}
              onPress={() => handleDateSelect(date)}
            >
              <Text style={styles.dateButtonText}>{date}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.noDataText}>No workout sessions logged yet.</Text>
      )}

      {selectedDate && (
        <View style={styles.exerciseList}>
          <Text style={styles.subtitle}>Exercises on {selectedDate}:</Text>
          {exerciseData.length > 0 ? (
            exerciseData.map((item, index) => (
              <View key={index} style={styles.exerciseCard}>
                <Text style={styles.exerciseText}>{item.exercise}</Text>
                {item.sets.map((set, setIndex) => (
                  <Text key={setIndex} style={styles.setDetails}>
                    Set {setIndex + 1}: {set.reps} reps @ {set.weight} lbs
                  </Text>
                ))}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No exercises found for this date.</Text>
          )}
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
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#222',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  dateButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  dateButtonSelected: {
    backgroundColor: '#1a73e8',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  exerciseList: {
    marginTop: 20,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  setDetails: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    marginBottom: 4,
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default HistoryScreen;
