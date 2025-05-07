import React, { useState } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet } from 'react-native';
import { firestore } from '../FirebaseConfig'; // Firestore config
import { getAuth } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Calendar } from 'react-native-calendars'; // Import the Calendar component

const LogLiftScreen = () => {
  const [sessionDate, setSessionDate] = useState<string>(''); // Manually inputted date as string (MM/DD/YY)
  const [exercise, setExercise] = useState<string>(''); // Exercise name
  const [reps, setReps] = useState<string>(''); // Reps
  const [weight, setWeight] = useState<string>(''); // Weight
  const [sets, setSets] = useState<{ reps: string; weight: string }[]>([]); // Store sets for each exercise
  const [exercisesList, setExercisesList] = useState<{ exercise: string; sets: { reps: string; weight: string }[] }[]>([]); // Store exercises with sets

  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false); // State to control calendar visibility

  // Add a set to the current exercise
  const addSet = () => {
    if (reps && weight) {
      setSets([...sets, { reps, weight }]);
      setReps(''); // Clear the reps field
      setWeight(''); // Clear the weight field
    }
  };

  // Add exercise with its sets to the session
  const addExercise = () => {
    if (exercise && sets.length > 0) {
      setExercisesList([...exercisesList, { exercise, sets }]);
      setExercise(''); // Clear the exercise field
      setSets([]); // Clear the sets
    }
  };

  // Save session data to Firebase
  const saveSession = async () => {
    const user = getAuth().currentUser;
    if (user && sessionDate && exercisesList.length > 0) {
      try {
        // Create a new session document
        await addDoc(collection(firestore, 'lifts', user.uid, 'sessions'), {
          date: sessionDate,  // Save the date entered by the user
          timestamp: serverTimestamp(),
          exercises: exercisesList,
        });
        alert('Session saved successfully!');
        setExercisesList([]); // Clear exercises list after saving
        setSessionDate(''); // Clear the date input
      } catch (error) {
        console.error('Error saving session:', error);
      }
    } else {
      alert('Please provide all details before saving.');
    }
  };

  // Function to handle date selection from the calendar
  const onDateSelect = (day: { dateString: string }) => {
    setSessionDate(day.dateString); // Set selected date to sessionDate
    setIsCalendarVisible(false); // Close the calendar after date selection
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Log Your Workout Session</Text>

        {/* Session Date Picker */}
        <Text style={styles.label}>Session Date</Text>
        <TextInput
          style={styles.input}
          placeholder="Select date"
          value={sessionDate}
          editable={false} // Make the input field non-editable, as we are using calendar picker
        />
        <Button title="Pick Date" onPress={() => setIsCalendarVisible(true)} /> {/* Button to open calendar */}
        
        {isCalendarVisible && (
          <Calendar
            markedDates={{
              [sessionDate]: { selected: true, selectedColor: 'blue' },
            }}
            onDayPress={onDateSelect} // Set the selected date
          />
        )}

        {/* Exercise Input */}
        <Text style={styles.label}>Exercise</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter exercise name"
          value={exercise}
          onChangeText={setExercise}
        />

        {/* Reps Input */}
        <Text style={styles.label}>Reps</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter reps"
          value={reps}
          onChangeText={setReps}
          keyboardType="number-pad"
        />

        {/* Weight Input */}
        <Text style={styles.label}>Weight (lbs)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="number-pad"
        />

        {/* Add set button */}
        <Button title="Add Set" onPress={addSet} />

        {/* Display sets added */}
        {sets.length > 0 && (
          <View style={styles.setsContainer}>
            <Text style={styles.subHeader}>Sets Added:</Text>
            {sets.map((set, index) => (
              <Text key={index} style={styles.setText}>
                Reps: {set.reps}, Weight: {set.weight} lbs
              </Text>
            ))}
          </View>
        )}

        {/* Add exercise button */}
        <Button title="Add Exercise" onPress={addExercise} />

        {/* Display exercises added */}
        {exercisesList.length > 0 && (
          <View style={styles.exercisesContainer}>
            <Text style={styles.subHeader}>Exercises Added:</Text>
            {exercisesList.map((item, index) => (
              <View key={index}>
                <Text style={styles.exerciseText}>{item.exercise}</Text>
                {item.sets.map((set, setIndex) => (
                  <Text key={setIndex} style={styles.setText}>
                    Reps: {set.reps}, Weight: {set.weight} lbs
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Save session button */}
        <Button title="Save Session" onPress={saveSession} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
  },
  setsContainer: {
    marginVertical: 10,
  },
  setText: {
    fontSize: 14,
    marginLeft: 10,
  },
  exercisesContainer: {
    marginVertical: 10,
  },
  exerciseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default LogLiftScreen;
