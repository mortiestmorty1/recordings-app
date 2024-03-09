import React, { useEffect, useState } from 'react';
import {Image, View, Text, Button, StyleSheet, Alert, Platform ,TouchableWithoutFeedback, ImageBackground} from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';
import { Svg, Path, Rect } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
import ring1 from '../assets/ring1.svg';

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
              
              <Svg style={styles.logo} fill="#000000" width="150" height="150" viewBox="0 0 1024 1024">
                    <Path d="M510.88 704h7.6C607.44 704 672 638.4 672 548.032V166.624C672 73.184 604.56 0 518.466 0h-7.584C423.264 0 352 74.752 352 166.624v381.408C352 636.944 420.304 704 510.88 704zM416 166.624C416 110.032 458.56 64 510.88 64h7.6C569.504 64 608 108.128 608 166.624v381.408C608 603.024 572.032 640 518.464 640h-7.584c-55.872 0-94.88-37.808-94.88-91.968zM800 352c-17.68 0-32 14.336-32 32v133.072c0 190.4-67.968 282.929-207.744 282.929H465.12c-182.8 0-209.12-153.84-209.12-282.928V384.001c0-17.664-14.336-32-32-32s-32 14.336-32 32v133.072c0 220.496 91.888 346.928 273.12 346.928H480v96H320c-17.664 0-32 14.336-32 32s14.336 32 32 32h384c17.664 0 32-14.336 32-32s-14.336-32-32-32H544v-96h16.256C684.224 864.001 832 803.809 832 517.072V384c0-17.664-14.32-32-32-32z" />
              </Svg>
             
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
    marginBottom: 20,
  },
  

});

export default Home;
