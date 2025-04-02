import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function SetGoalScreen({ navigation }: any) {
  const [goal, setGoal] = useState<string>('');

  const handleSetGoal = () => {
    // Save goal logic here
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Set Your Goal</Text>
      <TextInput
        style={styles.input}
        placeholder="Goal (e.g., 150kg)"
        value={goal}
        keyboardType="numeric"
        onChangeText={setGoal}
      />
      <Button title="Set Goal" onPress={handleSetGoal} />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
});
