import React, { useState } from 'react';
import { Text, Button, StyleSheet , Image } from 'react-native';

const FirstScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require('../assets/mic.svg')}
            />
            <Button title="Get Started" onPress={handleRegistration} />
            <Text style={styles.text}>Already registered?</Text>
            <Button title="Revisit" onPress={handleRegistration} />
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
