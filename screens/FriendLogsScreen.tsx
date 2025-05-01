// screens/FriendLogsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { firestore } from '../FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

const FriendLogsScreen = ({ route }: any) => {
  const { username } = route.params;  // Get the friend's username from params
  const [friendLogs, setFriendLogs] = useState<any[]>([]);  // Store friend's logs
  const [loading, setLoading] = useState<boolean>(false);

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
        const friendDoc = querySnapshot.docs[0];  // Assuming the first document is the correct one
        const friendId = friendDoc.id;

        // Now fetch the sessions for that friend
        const sessionsRef = collection(firestore, 'lifts', friendId, 'sessions');
        const sessionsSnapshot = await getDocs(sessionsRef);

        const logs: any[] = [];
        sessionsSnapshot.forEach((doc) => {
          logs.push(doc.data());
        });

        setFriendLogs(logs);
      }
    } catch (error) {
      console.error('Error fetching friend logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Logs for {username}</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : friendLogs.length > 0 ? (
        friendLogs.map((log, index) => (
          <View key={index} style={styles.logContainer}>
            <Text style={styles.dateText}>{log.date}</Text>
            {log.exercises.map((exercise: any, idx: number) => (
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
        <Text>No logs found for this user.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
  },
  exerciseCard: {
    marginTop: 10,
  },
  exerciseText: {
    fontSize: 16,
    fontWeight: '500',
  },
  setText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default FriendLogsScreen;
