import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FirstScreen from './components/firstscreen'; // Adjust the import path as necessary
import RegisterUser from './components/registerUser';
import Revisit from './components/revisit';
import  Home from './components/home';

const Stack = createStackNavigator();

function App() {
  return (
    <View style={styles.container}>
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          name="FirstScreen"
          component={FirstScreen}
          options={{ headerShown: false }} // This hides the header only for FirstScreen
        />
        <Stack.Screen name="RegisterUser" component={RegisterUser} />
        <Stack.Screen name="Revisit" component={Revisit} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
    <StatusBar style="auto" />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

export default App;
