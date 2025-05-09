import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { firestore } from '../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { query, where, getDocs, collection, doc, setDoc } from 'firebase/firestore';

const AddFriendScreen = () => {
  const [friendUsername, setFriendUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFriend = async () => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        setIsLoading(true);
        setError('');
        setSuccess('');

        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('username', '==', friendUsername.trim()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('Friend not found. Please check the username.');
        } else {
          const friendDoc = querySnapshot.docs[0];
          const userRef = doc(firestore, 'users', user.uid);

          await setDoc(userRef, {
            friends: [friendUsername],
          }, { merge: true });

          setSuccess('Friend added successfully!');
          setFriendUsername('');
        }
      } catch (error) {
        console.error('Error adding friend:', error);
        setError('Something went wrong. Try again later.');
      } finally {
        setIsLoading(false);
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
        placeholder="Friend's username"
        value={friendUsername}
        onChangeText={setFriendUsername}
        placeholderTextColor="#aaa"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleAddFriend} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Adding...' : 'Add Friend'}</Text>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator size="small" color="#007AFF" style={{ marginTop: 10 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default AddFriendScreen;
