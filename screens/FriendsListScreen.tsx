import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { firestore } from '../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const FriendsListScreen = ({ navigation }: any) => {
  const [friends, setFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
    navigation.navigate('FriendLogs', { username: friendUsername });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Friends</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : friends.length > 0 ? (
        friends.map((friend, index) => (
          <TouchableOpacity
            key={index}
            style={styles.friendCard}
            onPress={() => handleFriendClick(friend)}
          >
            <Text style={styles.friendText}>{friend}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noFriendsText}>You haven't added any friends yet.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  friendCard: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  friendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noFriendsText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FriendsListScreen;
