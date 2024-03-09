import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Platform ,TouchableWithoutFeedback} from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';
import { Svg, Path } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';

const Home = ({ navigation, route }) => {
  const [texts, setTexts] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const userId = route.params.userId; // Assuming userID is passed correctly through route.params
  const count = route.params.count;
  const name = route.params.name;
  const email = route.params.email;

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

    if (isRecording) {
        await stopRecording();
    }

    try {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();
        setRecording(recording);
        setIsRecording(true);
        console.log('Recording started');
    } catch (err) {
        console.error('Failed to start recording:', err);
        Alert.alert("Error", "Failed to start recording. Please try again.");
    }
};

const stopRecordingAndUpload = async () => {
    if (!recording) {
      console.log("No active recording to stop.");
      return;
    }

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);
      console.log('Recording stopped and stored at', uri);
      await uploadRecording(uri);
      // Now, move to the next text after uploading
      handleNextText();
    } catch (error) {
      console.error("Error stopping recording:", error);
      Alert.alert("Error", "Failed to stop the recording. Please try again.");
    }
  };

const uploadRecording = async (uri) => {
    const fileType = 'audio/mp3';
    const fileName = `recording_${Date.now()}_${name}_TextID_${texts[currentTextIndex]._id}.mp3`;

    const cleanUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('textId', texts[currentTextIndex]._id);
    formData.append('audio', { // Make sure this key matches what the backend expects
        uri: cleanUri,
        name: fileName,
        type: fileType,
    });

    console.log('Uploading recording:', formData);

    try {
        const response = await axios.post('http://localhost:3001/recordings/createRecordings', formData);
        console.log('Upload successful:', response.data);
        try{

            const response = await axios.put(`http://localhost:3001/user/update?email=${encodeURIComponent(email)}`);
            console.log('Count incremented:', response.data);
        }
        catch(error){
            console.error('Count increment failed:', error);
            Alert.alert("Count Increment Failed", `An error occurred: ${error.message}`);
        }
    } catch (error) {
        console.error('Upload failed:', error);
        Alert.alert("Upload Failed", `An error occurred: ${error.message}`);
    }
    await FileSystem.deleteAsync(cleanUri, { idempotent: true });

    console.log('Recording file deleted:', cleanUri);
};



  const fetchTexts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/text/getall');
      setTexts(response.data.message);
    } catch (error) {
      console.error('Failed to fetch texts:', error);
    }
  };

  const handleNextText = () => {
    if (currentTextIndex < texts.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1);
    } else {
      Alert.alert('Completed', 'You have completed all texts!');
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
          <Text style={styles.text}>{texts[currentTextIndex]?.text}</Text>
          <TouchableWithoutFeedback
            onPressIn={startRecording} // Start recording on button press
            onPressOut={stopRecordingAndUpload} // Stop and upload recording on button release
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>
                {isRecording ? "Release to Stop" : "Hold to Record"}
              </Text>
            </View>
          </TouchableWithoutFeedback>

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
  text: {
    marginBottom: 20, // Example style for text
  },
  // Add other styles as needed
});

export default Home;
