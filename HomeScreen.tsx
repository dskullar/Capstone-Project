import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Your Gym Dashboard</Text>
      <Button title="Log a Lift" onPress={() => navigation.navigate('Log Lift')} />
      <Button title="Set Goal" onPress={() => navigation.navigate('Set Goal')} />
      <Button title="Check Progress" onPress={() => navigation.navigate('Progress')} />
      <Button title="View Workout History" onPress={() => navigation.navigate('History')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});
