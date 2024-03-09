import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform, Alert } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const Home = ({ navigation ,route}) => {
  const [texts, setTexts] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [userId, setUserId] = useState(route.params);

  const fetchUserId = async () => {
    try {


  useEffect(() => {
    fetchTexts();
    requestMicrophonePermission();
  }, []);

  const requestMicrophonePermission = async () => {
    const permissionResponse = await Audio.requestPermissionsAsync();
    if (permissionResponse.status !== 'granted') {
      Alert.alert('Permission Required', 'This app needs microphone permissions to record audio.');
    }
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) {
      return;
    }
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    setIsRecording(false);
    console.log('Recording stopped and stored at', uri);
    uploadRecording(uri);
  };

  const uploadRecording = async (uri) => {
    let fileType = 'audio/mpeg'; 
    let formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
      name: `recording_${Date.now()}.mp3`,
      type: fileType,
    });
    formData.append('userId', 'yourUserId');
    formData.append('textId', texts[currentTextIndex]._id);

    try {
      const response = await axios.post('http://localhost:3001/recordings/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successful:', response.data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const fetchTexts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/text/getall');
      setTexts(response.data.message); // Assuming the response contains an array of texts
    } catch (error) {
      console.error('Failed to fetch texts:', error);
    }
  };

  const handleNextText = async () => {
    if (isRecording) {
      await stopRecording();
    }

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
          <Text>{texts[currentTextIndex]?.text}</Text>
          <Button title={isRecording ? "Stop Recording" : "Start Recording"} onPress={isRecording ? stopRecording : startRecording} />
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
  // Add other styles as needed
});

export default Home;
