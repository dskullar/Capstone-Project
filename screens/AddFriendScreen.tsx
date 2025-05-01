import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { firestore } from '../FirebaseConfig'; // Ensure correct path
import { getAuth } from 'firebase/auth';
import { query, where, getDocs, collection, doc, setDoc } from 'firebase/firestore';

const AddFriendScreen = () => {
  const [friendUsername, setFriendUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // To track successful friend addition
  const [isLoading, setIsLoading] = useState(false); // Track if we're waiting for Firestore response

  const handleAddFriend = async () => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        setIsLoading(true);
        setError('');
        setSuccess('');

        // Query Firestore users collection to find the friend by their username
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('username', '==', friendUsername));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('Friend not found. Please check the username.');
        } else {
          // If friend exists, add the username to the current user's friends list
          const friendDoc = querySnapshot.docs[0]; // Assume the first match is the correct one
          const userRef = doc(firestore, 'users', user.uid);

          // Add friend username to current user's friends array (merge to avoid overwriting)
          await setDoc(userRef, {
            friends: [friendUsername], // Adding the friend to the friends list
          }, { merge: true });

          setSuccess('Friend added successfully!');
          setFriendUsername(''); // Clear the input field
        }
      } catch (error) {
        console.error('Error adding friend:', error);
        setError('Error adding friend. Please try again later.');
      } finally {
        setIsLoading(false); // Stop the loading indicator
      }
    } else {
      setError('No user is logged in.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Friend</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter friend's username"
        value={friendUsername}
        onChangeText={setFriendUsername}
      />
      
      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>{success}</Text>}

      <Button title="Add Friend" onPress={handleAddFriend} disabled={isLoading} />
      
      {isLoading && <Text style={styles.loadingText}>Loading...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  success: {
    color: 'green',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: 'blue',
  },
});

export default AddFriendScreen;
