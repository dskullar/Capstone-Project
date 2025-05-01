// HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { firestore } from '../FirebaseConfig';  // Firebase config
import { doc, getDoc } from 'firebase/firestore';

const HomeScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState<string>(''); // State to hold the username

  useEffect(() => {
    const fetchUsername = async () => {
      const user = getAuth().currentUser; // Get the current logged-in user
      if (user) {
        try {
          const userDocRef = doc(firestore, 'users', user.uid); // Firestore reference to the user's document
          const userDoc = await getDoc(userDocRef); // Get the user's document
          if (userDoc.exists()) {
            setUsername(userDoc.data()?.username || ''); // Set the username
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      }
    };

    fetchUsername();
  }, []); // Empty dependency array means this runs only once when the component mounts

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to GymApp!</Text>
      {username ? (
        <Text style={styles.username}>Hello, {username}!</Text> // Display the username
      ) : (
        <Text style={styles.username}>Hello, User!</Text>
      )}
      <Text style={styles.subtitle}>Track your lifts and progress easily</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LogLift')}
      >
        <Text style={styles.buttonText}>Log Your Lift</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Progress')}
      >
        <Text style={styles.buttonText}>View Progress</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.buttonText}>View History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddFriend')}
      >
        <Text style={styles.buttonText}>Add Friend</Text>
      </TouchableOpacity>

      {/* New Buttons to Navigate to Friends List */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FriendsList')} // Navigate to FriendsListScreen
      >
        <Text style={styles.buttonText}>View Friends</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  username: {
    fontSize: 20,
    color: '#007bff',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default HomeScreen;
