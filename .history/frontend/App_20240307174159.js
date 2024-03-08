import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import RegisterUser from './components/registerUser.js'; // Adjust the path as necessary

export default function App() {
  const handleRegistrationSuccess = (userData) => {
    console.log('User registered:', userData);
    // Additional actions upon successful registration
  };

  return (
    <View style={styles.container}>
      <RegisterUser onSubmit={handleRegistrationSuccess} />
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
