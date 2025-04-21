// screens/LogLiftScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const LogLiftScreen = ({ navigation }: any) => {
  const [liftAmount, setLiftAmount] = useState('');

  const handleSaveLift = () => {
    // Logic to save the lift amount (e.g., save to state, database, etc.)
    console.log('Lift logged:', liftAmount);
    navigation.navigate('Progress'); // Navigate to Progress Screen
  };

  return (
    <View>
      <Text>Log Your Lift</Text>
      <TextInput
        value={liftAmount}
        onChangeText={setLiftAmount}
        placeholder="Enter Lift Amount"
        keyboardType="numeric"
      />
      <Button title="Save Lift" onPress={handleSaveLift} />
    </View>
  );
};

export default LogLiftScreen;
