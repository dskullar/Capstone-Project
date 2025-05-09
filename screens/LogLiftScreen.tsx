import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { firestore } from '../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Calendar } from 'react-native-calendars';

const LogLiftScreen = () => {
  const [sessionDate, setSessionDate] = useState('');
  const [exercise, setExercise] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState<{ reps: string; weight: string }[]>([]);
  const [exercisesList, setExercisesList] = useState<{ exercise: string; sets: { reps: string; weight: string }[] }[]>([]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const addSet = () => {
    if (reps && weight) {
      setSets([...sets, { reps, weight }]);
      setReps('');
      setWeight('');
    }
  };

  const addExercise = () => {
    if (exercise && sets.length > 0) {
      setExercisesList([...exercisesList, { exercise, sets }]);
      setExercise('');
      setSets([]);
    }
  };

  const saveSession = async () => {
    const user = getAuth().currentUser;
    if (user && sessionDate && exercisesList.length > 0) {
      try {
        await addDoc(collection(firestore, 'lifts', user.uid, 'sessions'), {
          date: sessionDate,
          timestamp: serverTimestamp(),
          exercises: exercisesList,
        });
        alert('Session saved successfully!');
        setExercisesList([]);
        setSessionDate('');
      } catch (error) {
        console.error('Error saving session:', error);
      }
    } else {
      alert('Please provide all details before saving.');
    }
  };

  const onDateSelect = (day: { dateString: string }) => {
    setSessionDate(day.dateString);
    setIsCalendarVisible(false);
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.header}>Log Your Workout</Text>

        <Text style={styles.label}>Session Date</Text>
        <TouchableOpacity onPress={() => setIsCalendarVisible(true)} style={styles.input}>
          <Text style={{ color: sessionDate ? '#000' : '#aaa' }}>
            {sessionDate || 'Select a date'}
          </Text>
        </TouchableOpacity>

        {isCalendarVisible && (
          <Calendar
            markedDates={{ [sessionDate]: { selected: true, selectedColor: 'blue' } }}
            onDayPress={onDateSelect}
          />
        )}

        <Text style={styles.label}>Exercise</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter exercise name"
          value={exercise}
          onChangeText={setExercise}
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Reps</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter reps"
          value={reps}
          onChangeText={setReps}
          keyboardType="number-pad"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Weight (lbs)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="number-pad"
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.button} onPress={addSet}>
          <Text style={styles.buttonText}>Add Set</Text>
        </TouchableOpacity>

        {sets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Sets:</Text>
            {sets.map((set, index) => (
              <Text key={index} style={styles.setText}>
                Set {index + 1}: {set.reps} reps @ {set.weight} lbs
              </Text>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={addExercise}>
          <Text style={styles.buttonText}>Add Exercise</Text>
        </TouchableOpacity>

        {exercisesList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Exercises:</Text>
            {exercisesList.map((item, index) => (
              <View key={index}>
                <Text style={styles.exerciseTitle}>{item.exercise}</Text>
                {item.sets.map((set, i) => (
                  <Text key={i} style={styles.setText}>
                    Set {i + 1}: {set.reps} reps @ {set.weight} lbs
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={saveSession}>
          <Text style={styles.buttonText}>Save Session</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#f8f9fa',
  },
  container: {
    padding: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
    color: '#444',
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  setText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    color: '#222',
  },
});

export default LogLiftScreen;
