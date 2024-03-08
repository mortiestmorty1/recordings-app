import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Switch } from 'react-native';
import axios from 'axios';
import { Svg, Path } from 'react-native-svg'; // Import Axios

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
      <Svg style={styles.logo} fill="#000000" width="150" height="150" viewBox="0 0 1024 1024">
          <Path d="M510.88 704h7.6C607.44 704 672 638.4 672 548.032V166.624C672 73.184 604.56 0 518.466 0h-7.584C423.264 0 352 74.752 352 166.624v381.408C352 636.944 420.304 704 510.88 704zM416 166.624C416 110.032 458.56 64 510.88 64h7.6C569.504 64 608 108.128 608 166.624v381.408C608 603.024 572.032 640 518.464 640h-7.584c-55.872 0-94.88-37.808-94.88-91.968zM800 352c-17.68 0-32 14.336-32 32v133.072c0 190.4-67.968 282.929-207.744 282.929H465.12c-182.8 0-209.12-153.84-209.12-282.928V384.001c0-17.664-14.336-32-32-32s-32 14.336-32 32v133.072c0 220.496 91.888 346.928 273.12 346.928H480v96H320c-17.664 0-32 14.336-32 32s14.336 32 32 32h384c17.664 0 32-14.336 32-32s-14.336-32-32-32H544v-96h16.256C684.224 864.001 832 803.809 832 517.072V384c0-17.664-14.32-32-32-32z" />
        </Svg>
        <Text>Set up your account</Text>
        <Text>you need to provide us the given below information and your consent is needed to record your voices with out you cannot continue</Text>
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
          trackColor={{ false: "#767577", true: "#808080" }}
          thumbColor={consent ? "#f4f3f4" : "#f4f3f4"}
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
  logo: {
    bottom: 100,
  },
});

export default RegisterUser;
