import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { firestore } from '../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Calendar } from 'react-native-calendars';
import { BarChart } from 'react-native-chart-kit';

const ProgressScreen = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exerciseList, setExerciseList] = useState<any[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [isStartDateCalendarVisible, setIsStartDateCalendarVisible] = useState(false);
  const [isEndDateCalendarVisible, setIsEndDateCalendarVisible] = useState(false);

  useEffect(() => {
    if (startDate && endDate) fetchExercisesForDateRange();
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
              exercises.push({ exercise: exercise.exercise, sets: exercise.sets });
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
    setSelectedExercises((prev) =>
      prev.includes(exercise) ? prev.filter((e) => e !== exercise) : [...prev, exercise]
    );
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
          sessionsData.push({
            week: data.date,
            exercises: data.exercises.filter((exercise: any) =>
              selectedExercises.includes(exercise.exercise)
            ),
          });
        });

        const calculatedProgressData = calculateProgress(sessionsData);
        setProgressData(calculatedProgressData);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  const calculateProgress = (sessionsData: any[]) => {
    const sortedSessions = sessionsData.sort(
      (a, b) => new Date(a.week).getTime() - new Date(b.week).getTime()
    );

    return sortedSessions.map((weekData, index) => {
      const previousWeekData = index > 0 ? sortedSessions[index - 1] : null;

      const exercises = weekData.exercises.map((exercise: any) => {
        const sets = exercise.sets.map((set: any, setIndex: number) => {
          let progress = null;

          if (previousWeekData) {
            const prevExercise = previousWeekData.exercises.find(
              (prev: any) => prev.exercise === exercise.exercise
            );
            const prevSet = prevExercise?.sets[setIndex];

            if (prevSet) {
              const weightIncrease = parseFloat(set.weight) - parseFloat(prevSet.weight);
              const percentageIncrease = (weightIncrease / parseFloat(prevSet.weight)) * 100;

              progress = { weightIncrease, percentageIncrease };
            }
          }

          return { ...set, progress };
        });

        return { ...exercise, sets };
      });

      return { ...weekData, exercises };
    });
  };

  const generateBarChartData = () => {
    const labels: string[] = [];
    const data: number[] = [];

    if (progressData.length >= 2) {
      const firstSession = progressData[0];
      const lastSession = progressData[progressData.length - 1];

      selectedExercises.forEach((exerciseName: string) => {
        const first = firstSession.exercises.find((e: any) => e.exercise === exerciseName);
        const last = lastSession.exercises.find((e: any) => e.exercise === exerciseName);

        const firstMax = first ? Math.max(...first.sets.map((s: any) => parseFloat(s.weight))) : 0;
        const lastMax = last ? Math.max(...last.sets.map((s: any) => parseFloat(s.weight))) : 0;

        labels.push(`${exerciseName} - Start`);
        data.push(firstMax);
        labels.push(`${exerciseName} - End`);
        data.push(lastMax);
      });
    }

    return { labels, datasets: [{ data }] };
  };

  const onStartDateSelect = (day: { dateString: string }) => {
    setStartDate(day.dateString);
    setIsStartDateCalendarVisible(false);
  };

  const onEndDateSelect = (day: { dateString: string }) => {
    setEndDate(day.dateString);
    setIsEndDateCalendarVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Compare Your Progress</Text>

      {/* Date Pickers */}
      <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity style={styles.input} onPress={() => setIsStartDateCalendarVisible(true)}>
        <Text style={startDate ? styles.inputText : styles.placeholderText}>
          {startDate || 'Pick a start date'}
        </Text>
      </TouchableOpacity>
      {isStartDateCalendarVisible && (
        <Calendar markedDates={{ [startDate]: { selected: true, selectedColor: 'blue' } }} onDayPress={onStartDateSelect} />
      )}

      <Text style={styles.label}>End Date</Text>
      <TouchableOpacity style={styles.input} onPress={() => setIsEndDateCalendarVisible(true)}>
        <Text style={endDate ? styles.inputText : styles.placeholderText}>
          {endDate || 'Pick an end date'}
        </Text>
      </TouchableOpacity>
      {isEndDateCalendarVisible && (
        <Calendar markedDates={{ [endDate]: { selected: true, selectedColor: 'blue' } }} onDayPress={onEndDateSelect} />
      )}

      {/* Exercise Selection */}
      <Text style={styles.subtitle}>Select Exercises</Text>
      {exerciseList.map((item, index) => (
        <View key={index} style={styles.exerciseCard}>
          <Text style={styles.exerciseText}>{item.exercise}</Text>
          <TouchableOpacity
            style={[
              styles.selectButton,
              {
                backgroundColor: selectedExercises.includes(item.exercise) ? 'green' : '#2196F3',
              },
            ]}
            onPress={() => handleExerciseSelect(item.exercise)}
          >
            <Text style={styles.buttonText}>Select</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.compareButton} onPress={handleCompare}>
        <Text style={styles.buttonText}>Compare Progress</Text>
      </TouchableOpacity>

      {/* Bar Chart */}
      {progressData.length >= 2 && (
        <View>
          <Text style={styles.subtitle}>Max Weight Comparison</Text>
          <BarChart
            data={generateBarChartData()}
            width={Dimensions.get('window').width - 40}
            height={260}
            yAxisLabel=""
            yAxisSuffix=" lbs"
            fromZero
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#f7f7f7',
              backgroundGradientTo: '#f7f7f7',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForBackgroundLines: { stroke: '#ccc' },
            }}
            verticalLabelRotation={45}
            style={{ marginVertical: 10, borderRadius: 16 }}
          />
        </View>
      )}

      {/* Detailed Progress */}
      {progressData.map((weekData, index) => (
        <View key={index} style={styles.progressDataContainer}>
          <Text style={styles.subtitle}>Date: {weekData.week}</Text>
          {weekData.exercises.map((exercise: any, idx: number) => (
            <View key={idx} style={styles.exerciseDetails}>
              <Text style={styles.exerciseText}>{exercise.exercise}</Text>
              {exercise.sets.map((set: any, setIndex: number) => (
                <Text key={setIndex} style={styles.setDetails}>
                  Set {setIndex + 1}: {set.reps} reps @ {set.weight} lbs
                  {set.progress && (
                    <Text style={{ color: 'green' }}>
                      {' '}
                      (+{set.progress.weightIncrease} lbs, +{set.progress.percentageIncrease.toFixed(2)}%)
                    </Text>
                  )}
                </Text>
              ))}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f7f7f7' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, marginVertical: 5, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  inputText: { fontSize: 16, color: '#000' },
  placeholderText: { fontSize: 16, color: '#aaa' },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  exerciseCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseText: { fontSize: 16, fontWeight: '500' },
  selectButton: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
  compareButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  progressDataContainer: { marginBottom: 20 },
  exerciseDetails: { marginLeft: 10 },
  setDetails: { fontSize: 14, marginBottom: 4 },
});

export default ProgressScreen;
