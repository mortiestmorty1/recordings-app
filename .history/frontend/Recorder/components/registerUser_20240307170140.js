import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const RegisterUser = ({ onSubmit }) => {
  const [consent, setConsent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleRegistration = async () => {
    // Ensure all fields are filled
    if (!name || !email || !consent) {
      alert('Please fill all fields and provide consent to continue.');
      return;
    }

    const userPayload = { name, email, consent };

    // Here, replace 'YOUR_BACKEND_URL' with your actual backend URL
    const response = await fetch('YOUR_BACKEND_URL/user/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userPayload),
    });

    if (response.ok) {
      const data = await response.json();
      alert('Registration successful!');
      onSubmit && onSubmit(data); // Callback for successful registration
    } else {
      const errorData = await response.json();
      alert(`Registration failed: ${errorData.message}`);
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
      {/* Implement consent as a switch or a checkbox according to your design preference */}
      <Text>Consent:</Text>
      <Button title={consent ? "Consent Given" : "Give Consent"} onPress={() => setConsent(true)} />
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
