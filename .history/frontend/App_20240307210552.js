import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import RegisterUser from './components/registerUser.js';
import React from 'react';
import FirstScreen from './components/firstscreen.js';

export default function App() {
  const handleRegistrationSuccess = (userData) => {
    console.log('User registered:', userData);
  };

  return (
    <View style={styles.container}>
      <FirstScreen />
      {/* <RegisterUser onSubmit={handleRegistrationSuccess} /> */}
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
