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
    // Define the file type
    let fileType = 'audio/mpeg'; 
    // Prepare the form data
    let formData = new FormData();
    // Append the recording file
    formData.append('file', {
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
      name: `recording_${Date.now()}.mp3`, // The backend logic for naming is preserved, just sending the name
      type: fileType,
    });
    // Append the userId
    formData.append('userId', userId);
    // Append the textId
    formData.append('textId', texts[currentTextIndex]._id);
  
    try {
      // Attempt to send the formData to the backend
      const response = await axios.post('http://localhost:3001/recordings/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Log successful upload response
      console.log('Upload successful:', response.data);
    } catch (error) {
      // Log any errors
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
