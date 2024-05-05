import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Switch, ImageBackground } from 'react-native';
import axios from 'axios';
import { Svg, Path } from 'react-native-svg';
import background from '../assets/buttonbg.png';
import { ScrollView, KeyboardAvoidingView, Platform,} from 'react-native';



const Revisit = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleLogin = () => {
        axios.get(`http://localhost:3001/user/get?email=${encodeURIComponent(email)}`)
            .then((response) => {
                console.log(response.data);
                if (response.data.message === 'user found') {
                    const userId = response.data.userId;
                    const count = response.data.count;
                    const name = response.data.name;
                    navigation.navigate('Home', { 
                        userId: userId , 
                        count: count ,
                        name: name ,
                        email: email
                      });
                } else {
                    alert('User not found');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <ScrollView contentContainerStyle={styles.container}>
      <Svg style={styles.logo} fill="#000000" width="150" height="150" viewBox="0 0 1024 1024">
          <Path d="M510.88 704h7.6C607.44 704 672 638.4 672 548.032V166.624C672 73.184 604.56 0 518.466 0h-7.584C423.264 0 352 74.752 352 166.624v381.408C352 636.944 420.304 704 510.88 704zM416 166.624C416 110.032 458.56 64 510.88 64h7.6C569.504 64 608 108.128 608 166.624v381.408C608 603.024 572.032 640 518.464 640h-7.584c-55.872 0-94.88-37.808-94.88-91.968zM800 352c-17.68 0-32 14.336-32 32v133.072c0 190.4-67.968 282.929-207.744 282.929H465.12c-182.8 0-209.12-153.84-209.12-282.928V384.001c0-17.664-14.336-32-32-32s-32 14.336-32 32v133.072c0 220.496 91.888 346.928 273.12 346.928H480v96H320c-17.664 0-32 14.336-32 32s14.336 32 32 32h384c17.664 0 32-14.336 32-32s-14.336-32-32-32H544v-96h16.256C684.224 864.001 832 803.809 832 517.072V384c0-17.664-14.32-32-32-32z" />
        </Svg>
        <Text style={styles.title}>WELCOME BACK!</Text>
      <Text style={styles.liltitles}>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />
        <TouchableOpacity style={styles.loginbtn} 
        onPress={handleLogin}
        >
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <Text style={styles.logintext}>LOG IN</Text>
      </ImageBackground>
    </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
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
  liltitles:{
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    top: 10,
    right: 145
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
  loginbtn: {
    width: 250,
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    top: 20,
  },
  logintext: {
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

export default Revisit;
