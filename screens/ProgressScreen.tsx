import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
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

              progress = {
                weightIncrease,
                percentageIncrease,
              };
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
        const firstExercise = firstSession.exercises.find((e: any) => e.exercise === exerciseName);
        const lastExercise = lastSession.exercises.find((e: any) => e.exercise === exerciseName);

        const firstMax = firstExercise ? Math.max(...firstExercise.sets.map((s: any) => parseFloat(s.weight))) : 0;
        const lastMax = lastExercise ? Math.max(...lastExercise.sets.map((s: any) => parseFloat(s.weight))) : 0;

        labels.push(`${exerciseName} - Start`);
        data.push(firstMax);

        labels.push(`${exerciseName} - End`);
        data.push(lastMax);
      });
    }

    return {
      labels,
      datasets: [{ data }],
    };
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

      {/* Start Date Picker */}
      <Text style={styles.label}>Start Date</Text>
      <TextInput style={styles.input} value={startDate} editable={false} />
      <Button title="Pick Start Date" onPress={() => setIsStartDateCalendarVisible(true)} />
      {isStartDateCalendarVisible && (
        <Calendar markedDates={{ [startDate]: { selected: true, selectedColor: 'blue' } }} onDayPress={onStartDateSelect} />
      )}

      {/* End Date Picker */}
      <Text style={styles.label}>End Date</Text>
      <TextInput style={styles.input} value={endDate} editable={false} />
      <Button title="Pick End Date" onPress={() => setIsEndDateCalendarVisible(true)} />
      {isEndDateCalendarVisible && (
        <Calendar markedDates={{ [endDate]: { selected: true, selectedColor: 'blue' } }} onDayPress={onEndDateSelect} />
      )}

      {/* Exercise Selection */}
      <Text style={styles.subtitle}>Select Exercises to Compare</Text>
      {exerciseList.map((item, index) => (
        <View key={index} style={styles.exerciseCard}>
          <Text style={styles.exerciseText}>{item.exercise}</Text>
          <TouchableOpacity
            style={[
              styles.selectButton,
              { backgroundColor: selectedExercises.includes(item.exercise) ? 'green' : '#2196F3' },
            ]}
            onPress={() => handleExerciseSelect(item.exercise)}
          >
            <Text style={styles.buttonText}>Select</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleCompare}>
        <Text style={styles.buttonText}>Compare Progress</Text>
      </TouchableOpacity>

      {/* Bar Chart */}
      {progressData.length >= 2 && (
        <View>
          <Text style={styles.subtitle}>Highest Weight Comparison</Text>
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

      {/* Progress Details */}
      {progressData.map((weekData, index) => (
        <View key={index} style={styles.progressDataContainer}>
          <Text style={styles.subtitle}>Date: {weekData.week}</Text>
          {weekData.exercises.map((exerciseData: any, idx: number) => (
            <View key={idx} style={styles.exerciseDetails}>
              <Text style={styles.exerciseText}>{exerciseData.exercise}</Text>
              {exerciseData.sets.map((set: any, setIndex: number) => (
                <Text key={setIndex} style={styles.setDetails}>
                  Reps: {set.reps}, Weight: {set.weight} lbs
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
  label: {
    fontSize: 16,
    marginVertical: 5,
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
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  progressDataContainer: {
    marginTop: 20,
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
