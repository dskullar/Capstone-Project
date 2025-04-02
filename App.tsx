import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import LogLiftScreen from './LogLiftScreen';
import SetGoalScreen from './SetGoalScreen';
import ProgressScreen from './ProgressScreen';
import HistoryScreen from './HistoryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Log Lift" component={LogLiftScreen} />
        <Stack.Screen name="Set Goal" component={SetGoalScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
