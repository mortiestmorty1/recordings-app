import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FirstScreen from './components/firstscreen'; // Adjust the import path as necessary
import RegisterUser from './components/registerUser'; // Adjust the import path as necessary

const Stack = createStackNavigator();

function App() {
  return (
    <View style={styles.container}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="FirstScreen" component={FirstScreen} />
        <Stack.Screen name="RegisterUser" component={RegisterUser} />
      </Stack.Navigator>
    </NavigationContainer>
    <StatusBar style="auto" />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;