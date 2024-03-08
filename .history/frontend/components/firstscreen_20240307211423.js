import React, { useState } from 'react';
import {View, Text, Button, StyleSheet , Image } from 'react-native';
import { Svg, Circle, Rect } from 'react-native-svg';

const FirstScreen = () => {
    return (
        <View style={styles.container}>
            <Svg height="100" width="100">
    <Circle cx="50" cy="50" r="40" stroke="green" strokeWidth="4" fill="yellow" />
    <Rect x="15" y="15" width="70" height="70" stroke="red" strokeWidth="2" fill="blue" />
  </Svg>
            <Button title="Get Started"/>
            <Text style={styles.text}>Already registered?</Text>
            <Button title="Revisit"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
    text: {
        fontSize: 20,
        margin: 20,
    },
});

export default FirstScreen;
