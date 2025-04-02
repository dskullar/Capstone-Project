import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ProgressScreen() {
  const [progress, setProgress] = useState<number | null>(null);

  const calculateProgress = () => {
    // Example progress logic (based on stored data)
    setProgress(5); // Placeholder for percentage
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Progress Overview</Text>
      <Button title="Calculate Progress" onPress={calculateProgress} />
      {progress !== null && (
        <Text style={styles.progressText}>
          You lifted {progress}% more this week!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
