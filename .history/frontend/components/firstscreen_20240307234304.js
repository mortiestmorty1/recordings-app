import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient

const FirstScreen = () => {
  return (
    <LinearGradient
      colors={['#6082B6', '#A9A9A9']} // Define the gradient colors here
      style={styles.container}
    >
      <Svg style={styles.logo} fill="#000000" width="200" height="200" viewBox="0 0 1024 1024">
        <Path d="M510.88 704h7.6C607.44 704 672 638.4 672 548.032V166.624C672 73.184 604.56 0 518.466 0h-7.584C423.264 0 352 74.752 352 166.624v381.408C352 636.944 420.304 704 510.88 704zM416 166.624C416 110.032 458.56 64 510.88 64h7.6C569.504 64 608 108.128 608 166.624v381.408C608 603.024 572.032 640 518.464 640h-7.584c-55.872 0-94.88-37.808-94.88-91.968zM800 352c-17.68 0-32 14.336-32 32v133.072c0 190.4-67.968 282.929-207.744 282.929H465.12c-182.8 0-209.12-153.84-209.12-282.928V384.001c0-17.664-14.336-32-32-32s-32 14.336-32 32v133.072c0 220.496 91.888 346.928 273.12 346.928H480v96H320c-17.664 0-32 14.336-32 32s14.336 32 32 32h384c17.664 0 32-14.336 32-32s-14.336-32-32-32H544v-96h16.256C684.224 864.001 832 803.809 832 517.072V384c0-17.664-14.32-32-32-32z" />
      </Svg>
      <View style={styles.content}>
        <TouchableOpacity style={styles.btn1} onPress={() => console.log("Get Started pressed")}>
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
        <Text style={styles.text}>Already registered?</Text>
        <TouchableOpacity style={styles.btn1} onPress={() => console.log("Revisit pressed")}>
          <Text style={styles.btnText}>Revisit</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Ensure the container spans the full width
    height: '100%', // Ensure the container spans the full height
    // Remove backgroundColor since LinearGradient will cover it
  },
  logo: {
    marginBottom: 100,
  },
  text: {
    fontSize: 20,
    margin: 20,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '60%',
  },
  btn1: {
    width: 200,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  btnText: {
    color: '#6082B6',
  },
});

export default FirstScreen;
