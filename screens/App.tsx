// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import LogLiftScreen from './LogLiftScreen';
import ProgressScreen from './ProgressScreen';
import HistoryScreen from './HistoryScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import AddFriendScreen from './AddFriendScreen';  // Import AddFriendScreen
import FriendsListScreen from './FriendsListScreen';  // Import FriendsListScreen
import FriendLogsScreen from './FriendLogsScreen';  // Import FriendLogsScreen

type RootStackParamList = {
  Home: undefined;
  LogLift: undefined;
  Progress: undefined;
  History: undefined;
  Login: undefined;
  Register: undefined;
  AddFriend: undefined;  // Add AddFriend screen to the list
  FriendsList: undefined;  // Add FriendsList screen to the list
  FriendLogs: { username: string };  // Add FriendLogs screen with username parameter
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LogLift" component={LogLiftScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="AddFriend" component={AddFriendScreen} />  
        <Stack.Screen name="FriendsList" component={FriendsListScreen} />  
        <Stack.Screen name="FriendLogs" component={FriendLogsScreen} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
}
