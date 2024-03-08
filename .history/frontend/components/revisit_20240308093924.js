// Revisit.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Revisit = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeBackText}>Welcome back!</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeBackText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Revisit;
