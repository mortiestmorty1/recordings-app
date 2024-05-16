import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { View, Text, Button } from 'react-native';

const Test = () => {
  const [recording, setRecording] = useState(null);
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
        const { recording } = await Audio.Recording.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
        await recording.startAsync();
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
        console.log('Recording stopped:', uri); // Replace with playback
      } catch (err) {
        console.error('Error stopping recording:', err);
      }
    }
  };

  return (
    <View>
      <Text>Test Screen</Text>
      <Button title="Start Recording" onPress={startRecording} />
      <Button title="Stop Recording" onPress={stopRecording} />
    </View>
  );
};

export default Test;
