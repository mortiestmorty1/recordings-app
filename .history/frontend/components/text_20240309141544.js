import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const Text = () => {
  // Create an animated value for rotation
  const spinValue = useRef(new Animated.Value(0)).current;

  // Start spinning animation
  const startSpinning = () => {
    // First set the animated value to 0
    spinValue.setValue(0);
    // Then start an infinite loop animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1, // Rotate from 0 to 1
        duration: 2000, // Duration of one complete spin
        useNativeDriver: true, // Enable native driver for smoother animations
      })
    ).start();
  };

  useEffect(() => {
    startSpinning(); // Start the spinning animation when the component mounts
  }, []);

  // Interpolate spin value to convert 0 to 1 range into 0 to 360 degrees
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={startSpinning}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Svg style={styles.overlaySvg2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.8273 3 17.35 4.30367 19 6.34267" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
          </Svg>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlaySvg2: {
    width: 100,
    height: 100,
  },
});

export default Test