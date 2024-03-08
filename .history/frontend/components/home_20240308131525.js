import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';

const Home = ({ navigation }) => {
  const [texts, setTexts] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [recording, setRecording] = useState(null);
  const [userId, setUserId] = useState('USER_ID'); // Replace with logic to obtain the user's ID

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
    const uri = recording.getURI(); // URI to the recorded file
    setRecording(null);
    console.log('Recording stopped and stored at', uri);
    // Now you can handle the recording file (e.g., upload it to a server)
    uploadRecording(uri);
  };

  const uploadRecording = async (uri) => {
    // Example function to upload recording
    console.log('Uploading', uri);
    // Implement upload logic here
  };

  const fetchTexts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/text/getall');
      // Log the response to see its actual structure
      console.log('API Response:', response.data);
  
      // Use optional chaining and provide a default empty array
      const textsData = response.data.message ?? [];
      setTexts(textsData); // Assuming the response data structure
    } catch (error) {
      console.error('Failed to fetch texts:', error);
      // Set texts to an empty array if the request fails
      setTexts([]);
    }
  };
  

  const handleNextText = async () => {
    if (recording) {
      await stopRecording();
    }

    if (currentTextIndex < texts.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1);
    } else {
      Alert.alert('End of Texts', 'You have completed all texts!');
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
           <Text>{texts[currentTextIndex].text}</Text> {/* Ensure you display the text correctly */}
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
  // Define other styles if needed
});

export default Home;
