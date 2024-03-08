import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Switch, ImageBackground } from 'react-native';
import axios from 'axios';
import { Svg, Path } from 'react-native-svg';
import background from '../assets/buttonbg.png';

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
  
      const response = await axios.post('http://localhost:3001/user/create', userPayload);
      alert('Registration successful!');
      onSubmit && onSubmit(response.data);
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.message : error.message;
      alert(`Registration failed: ${errorMessage}`);
    }
  };

  return (
    <View style={styles.container}>
      <Svg style={styles.logo} fill="#000000" width="150" height="150" viewBox="0 0 1024 1024">
          <Path d="M510.88 704h7.6C607.44 704 672 638.4 672 548.032V166.624C672 73.184 604.56 0 518.466 0h-7.584C423.264 0 352 74.752 352 166.624v381.408C352 636.944 420.304 704 510.88 704zM416 166.624C416 110.032 458.56 64 510.88 64h7.6C569.504 64 608 108.128 608 166.624v381.408C608 603.024 572.032 640 518.464 640h-7.584c-55.872 0-94.88-37.808-94.88-91.968zM800 352c-17.68 0-32 14.336-32 32v133.072c0 190.4-67.968 282.929-207.744 282.929H465.12c-182.8 0-209.12-153.84-209.12-282.928V384.001c0-17.664-14.336-32-32-32s-32 14.336-32 32v133.072c0 220.496 91.888 346.928 273.12 346.928H480v96H320c-17.664 0-32 14.336-32 32s14.336 32 32 32h384c17.664 0 32-14.336 32-32s-14.336-32-32-32H544v-96h16.256C684.224 864.001 832 803.809 832 517.072V384c0-17.664-14.32-32-32-32z" />
        </Svg>
        <Text style={styles.title}>Set up your account</Text>
        <View style={styles.mustreadContainer}>
        <Text style={styles.mustread}>you need to provide us the given below information and </Text>
        <Text style={styles.mustread}>your consent is needed to record your voices</Text>
        <Text style={styles.mustread}>We need your consent to continue.</Text>
      </View>
      <Text style={styles.liltitles} >Name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
      />
      <Text style={styles.liltitles}>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />
      <Text style={styles.consent}>Consent:</Text>
      <Switch
          value={consent}
          onValueChange={(newValue) => setConsent(newValue)}
          trackColor={{ false: "#767577", true: "#808080" }}
          thumbColor={consent ? "#f4f3f4" : "#f4f3f4"}
        />
        <TouchableOpacity style={styles.registerbtn} onPress={handleRegistration}>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <Text style={styles.regtext}>Register</Text>
      </ImageBackground>
    </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  title:{
    fontSize: 20,
    margin: 20,
    color: 'black',
    fontWeight: 'bold',
    bottom: 60
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  mustreadContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 60
  },
  mustread:{
    fontSize: 15,
    color: '#808080',
  },
  liltitles:{
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    top: 10,
    right: 145
  },
  consent:{
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    top: 10,
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    width: '80%',
  },
  logo: {
    bottom: 100,
  },
  registerbtn: {
    width: 250,
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    top: 20,
  },
  regtext: {
    color: 'white',
    fontSize: 20,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default RegisterUser;
