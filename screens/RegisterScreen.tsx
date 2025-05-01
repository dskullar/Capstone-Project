import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../FirebaseConfig'; // Ensure correct path
import { setDoc, doc } from 'firebase/firestore';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Username field
  const [error, setError] = useState<string | null>(null); // Explicitly typing the error state

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User registered successfully');

      // Save the user information to Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        email: email,
        username: username, // Save the username
        friends: {}, // Empty friend list to start with
      });

      alert('User registered successfully');
    } catch (error: any) {
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
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
