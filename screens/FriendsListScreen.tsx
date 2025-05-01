// screens/FriendsListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { firestore } from '../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const FriendsListScreen = ({ navigation }: any) => {
  const [friends, setFriends] = useState<string[]>([]);  // Store the list of friends
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch friends list from Firestore
  useEffect(() => {
    fetchFriendsList();
  }, []);

  const fetchFriendsList = async () => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        setLoading(true);
        const userRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFriends(userData.friends || []);
        } else {
          Alert.alert('No user found', 'User data is not available.');
        }
      } catch (error) {
        console.error('Error fetching friends list:', error);
        Alert.alert('Error', 'Unable to fetch friends list.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFriendClick = (friendUsername: string) => {
    // When a friend is clicked, navigate to their log screen
    navigation.navigate('FriendLogs', { username: friendUsername });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Friends</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : friends.length > 0 ? (
        friends.map((friend, index) => (
          <TouchableOpacity
            key={index}
            style={styles.friendButton}
            onPress={() => handleFriendClick(friend)}
          >
            <Text style={styles.friendText}>{friend}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noFriendsText}>You have no friends added yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  friendButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    marginVertical: 10,
    borderRadius: 5,
  },
  friendText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  noFriendsText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});

export default FriendsListScreen;
