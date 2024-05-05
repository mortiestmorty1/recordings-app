import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { View, Button } from 'react-native';

const Test = () => {
  const [recording, setRecording] = useState(null);
  const [recordedUri, setRecordedUri] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestMicrophonePermission();
  }, []);

  const requestMicrophonePermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const startRecording = async () => {
    if (hasPermission) {
      try {
        // Correctly instantiate a new Recording object
        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await newRecording.startAsync();
        setRecording(newRecording);
      } catch (err) {
        console.error('Error starting recording:', err);
      }
    }
  };

  const stopRecording = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        // Store the URI for later use
        const uri = recording.getURI();
        setRecordedUri(uri); // Save the URI for playback
        console.log('Recording stopped and stored at:', uri);
      } catch (err) {
        console.error('Error stopping recording:', err);
      }
    }
  };

  const playRecording = async () => {
    if (recordedUri) {
      try {
        // Use the stored URI to play back the recording
        const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
        console.log('Playing recording:', recordedUri);
        await sound.playAsync();
      } catch (err) {
        console.error('Error playing recording:', err);
      }
    }
  };

  return (
    <View>
      <Button title="Start Recording" onPress={startRecording} />
      <Button title="Stop Recording" onPress={stopRecording} />
      <Button title="Play Recording" onPress={playRecording} />
    </View>
  );
};

export default Test;
