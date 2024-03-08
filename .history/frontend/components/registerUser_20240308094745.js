import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Switch } from 'react-native';
import axios from 'axios'; // Import Axios

const RegisterUser = ({ onSubmit }) => {
  const [consent, setConsent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleRegistration = async () => {
    if (!name || !email || !consent) {
      alert('Please fill all fields and provide consent to continue.');
      return;
    }

    const userPayload = { name, email, consent };
    try {
      // Make a POST request with Axios
      const response = await axios.post('http://localhost:3001/user/create', userPayload);
      
      // Axios automatically parses the JSON response
      alert('Registration successful!');
      onSubmit && onSubmit(response.data); // Callback for successful registration
    } catch (error) {
      // Axios encapsulates the response in error.response
      const errorMessage = error.response && error.response.data ? error.response.data.message : error.message;
      alert(`Registration failed: ${errorMessage}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
      />
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />
      <Text>Consent:</Text>
      <Switch
          value={consent}
          onValueChange={(newValue) => setConsent(newValue)}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={consent ? "#808080" : "#f4f3f4"}
        />
      <Button title="Register" onPress={handleRegistration} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
});

export default RegisterUser;
