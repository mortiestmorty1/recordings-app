import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();

const Home = ({ navigation }) => {
  const [texts, setTexts] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [userId, setUserId] = useState('USER_ID');

  useEffect(() => {
    fetchTexts();
    requestMicrophonePermission();
  }, []);
  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "App needs access to your microphone so you can record audio.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Microphone permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const startRecording = async () => {
    const path = `hello_${currentTextIndex}.mp3`; // Customize this path as needed
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    console.log('start recording');
    const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
    audioRecorderPlayer.addRecordBackListener((e) => {
      console.log('record-back', e);
      return;
    });
    console.log(`uri: ${uri}`);
    setIsRecording(true);
  };
  const stopRecording = async () => {
    console.log('stop recording');
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording(false);
    // Here you can handle the result.uri for uploading or further processing
    console.log(result);
  };
  const uploadRecording = async (filePath) => {
    const fileName = `recording_${currentTextIndex}.mp3`; // Customize this filename as needed
    const uploadUrl = 'http://localhost:3001/recordings/upload'; // Adjust your upload URL

    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'ios' ? filePath.replace('file://', '') : filePath,
      type: 'audio/mp3',
      name: fileName,
    });
    formData.append('userId', userId);
    formData.append('textId', texts[currentTextIndex]._id); // Assuming each text has an _id

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const responseBody = await response.json();
      console.log('Upload successful', responseBody);
    } catch (error) {
      console.error('Upload failed', error);
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
        <Button title={isRecording ? "Stop Recording" : "Start Recording"} onPress={startRecording} />
        <Button title="Next Text" onPress={handleNextText} />
      </View>
    )}
    <Button title="Logout" onPress={handleLogout} />
  </View>
  );
};

// Add your styles


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Add other styles if needed
});

export default Home;
