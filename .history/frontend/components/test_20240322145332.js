import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { View, Button } from 'react-native';

const Test = () => {
  const [recording, setRecording] = useState(null);
  const [recordedUri, setRecordedUri] = useState(null); // Add this state to store the URI
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
        // Correctly initialize a new recording instance
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
        const uri = recording.getURI();
        setRecordedUri(uri); // Store the recording URI
        console.log('Recording stopped:', uri);
        setRecording(null); // Reset recording state
      } catch (err) {
        console.error('Error stopping recording:', err);
      }
    }
  };

  const playRecording = async () => {
    if (recordedUri) {
      try {
        const { sound } = await Audio.Sound.createAsync({
          uri: recordedUri,
        });
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


