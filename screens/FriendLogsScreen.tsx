import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { firestore } from '../FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

const FriendLogsScreen = ({ route }: any) => {
  const { username } = route.params;
  const [friendLogs, setFriendLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchFriendLogs();
  }, []);

  const fetchFriendLogs = async () => {
    setLoading(true);
    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const friendDoc = querySnapshot.docs[0];
        const friendId = friendDoc.id;

        const sessionsRef = collection(firestore, 'lifts', friendId, 'sessions');
        const sessionsSnapshot = await getDocs(sessionsRef);

        const logs: any[] = [];
        sessionsSnapshot.forEach((doc) => logs.push(doc.data()));

        // Sort logs by date (newest first)
        logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setFriendLogs(logs);
      }
    } catch (error) {
      console.error('Error fetching friend logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDate = (date: string) => {
    setExpandedDates((prev) => {
      const newSet = new Set(prev);
      newSet.has(date) ? newSet.delete(date) : newSet.add(date);
      return newSet;
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Logs for {username}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : friendLogs.length > 0 ? (
        friendLogs.map((log, index) => (
          <View key={index} style={styles.dateCard}>
            <TouchableOpacity onPress={() => toggleDate(log.date)} style={styles.dateHeader}>
              <Text style={styles.dateText}>{log.date}</Text>
              <Text style={styles.expandText}>
                {expandedDates.has(log.date) ? 'Hide' : 'View'}
              </Text>
            </TouchableOpacity>

            {expandedDates.has(log.date) &&
              log.exercises.map((exercise: any, idx: number) => (
                <View key={idx} style={styles.exerciseCard}>
                  <Text style={styles.exerciseText}>{exercise.exercise}</Text>
                  {exercise.sets.map((set: any, setIndex: number) => (
                    <Text key={setIndex} style={styles.setText}>
                      Reps: {set.reps}, Weight: {set.weight} lbs
                    </Text>
                  ))}
                </View>
              ))}
          </View>
        ))
      ) : (
        <Text style={styles.noLogs}>No logs found for this user.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  dateCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
  },
  expandText: {
    fontSize: 14,
    color: '#007AFF',
  },
  exerciseCard: {
    marginTop: 10,
    paddingLeft: 10,
  },
  exerciseText: {
    fontSize: 16,
    fontWeight: '500',
  },
  setText: {
    fontSize: 14,
    marginLeft: 10,
    color: '#444',
  },
  noLogs: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default FriendLogsScreen;
