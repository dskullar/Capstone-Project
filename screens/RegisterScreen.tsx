import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../FirebaseConfig'; // Ensure correct path
import { StackNavigationProp } from '@react-navigation/stack';

// Define the type for navigation
type RegisterScreenNavigationProp = StackNavigationProp<any, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Explicitly typing the error state

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered successfully');
      navigation.navigate('Login');  // Navigate to login after successful registration
    } catch (error: any) { // Explicitly typing the error here
      setError(error.message);
      console.log('Registration error:', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
      />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
