import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';

const RecordingScreen = ({ navigation, route }) => {
  const { voiceNoteUrl } = route.params;
  const [sound, setSound] = useState();

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); 
        }
      : undefined;
  }, [sound]);

  const playSound = async () => {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       { uri: voiceNoteUrl },
       { shouldPlay: true }
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Playback Screen</Text>
      <Button title="Play Recording" onPress={playSound} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default RecordingScreen;
