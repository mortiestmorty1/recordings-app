import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

const Home = ({ navigation }) => {
  const [texts, setTexts] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [recording, setRecording] = useState(null);
  const [userId, setUserId] = useState('USER_ID'); // Replace with actual logic to get user ID

  useEffect(() => {
    fetchTexts();
    requestMicrophonePermission();
  }, []);

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
        title: 'Microphone Permission',
        message: 'App needs access to your microphone to record audio.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Microphone permission denied');
      }
    }
  };

  const startRecording = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    );

    setRecording(recording);
    console.log('Recording started');
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    // Optionally, you can upload the recording using uri
    uploadRecording(uri);
  };

  const uploadRecording = async (uri) => {
    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: 'audio/mpeg',
      name: `recording_${currentTextIndex}.mp3`,
    });
    formData.append('userId', userId);
    formData.append('textId', texts[currentTextIndex]._id); // Assuming each text has an _id

    try {
      const response = await axios.post('http://localhost:3001/recordings/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successful', response.data);
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  const fetchTexts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/text/getall');
      setTexts(response.data.message); // Assuming the response data structure
    } catch (error) {
      console.error('Failed to fetch texts:', error);
    }
  };

  const handleNextText = () => {
    if (currentTextIndex < texts.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1);
    } else {
      alert('You have completed all texts!');
    }
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'FirstScreen' }],
    });
  };

  return (
    <View style={styles.container}>
      {texts.length > 0 && (
        <View>
          <Text>{texts[currentTextIndex].text}</Text>
          <Button
            title={recording ? "Stop Recording" : "Start Recording"}
            onPress={recording ? stopRecording : startRecording}
          />
          <Button title="Next Text" onPress={handleNextText} />
        </View>
      )}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;