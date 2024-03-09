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
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="1080" height="1080" viewBox="0 0 1080 1080" xml:space="preserve">
<desc>Created with Fabric.js 5.2.4</desc>
<defs>
</defs>
<g transform="matrix(1 0 0 1 540 540)" id="069e021f-79c0-4f19-8e16-0f6f6131e460"  >
<rect style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1; visibility: hidden;" vector-effect="non-scaling-stroke"  x="-540" y="-540" rx="0" ry="0" width="1080" height="1080" />
</g>
<g transform="matrix(1 0 0 1 540 540)" id="b2254567-ac72-435c-b1e3-4d0f594ca5cc"  >
</g>
<g transform="matrix(0.63 0 0 0.63 540 540)" id="50340eb4-56d0-4b6b-86c9-e1a0c9d0f277"  >
<path style="stroke: rgb(0,0,0); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(-512, -512)" d="M 510.88 704 L 518.48 704 C 607.44 704 672 638.4 672 548.032 L 672 166.624 C 672 73.184 604.56 0 518.466 0 L 510.882 0 C 423.264 0 352 74.752 352 166.624 L 352 548.032 C 352 636.944 420.304 704 510.88 704 z M 416 166.624 C 416 110.032 458.56 64 510.88 64 L 518.48 64 C 569.504 64 608 108.128 608 166.624 L 608 548.032 C 608 603.024 572.032 640 518.464 640 L 510.88000000000005 640 C 455.00800000000004 640 416.00000000000006 602.192 416.00000000000006 548.032 z M 800 352 C 782.32 352 768 366.336 768 384 L 768 517.072 C 768 707.472 700.032 800.001 560.256 800.001 L 465.12 800.001 C 282.32 800.001 256 646.161 256 517.073 L 256 384.001 C 256 366.337 241.664 352.001 224 352.001 C 206.336 352.001 192 366.337 192 384.001 L 192 517.073 C 192 737.569 283.88800000000003 864.001 465.12 864.001 L 480 864.001 L 480 960.001 L 320 960.001 C 302.336 960.001 288 974.337 288 992.001 C 288 1009.665 302.336 1024.001 320 1024.001 L 704 1024.001 C 721.664 1024.001 736 1009.665 736 992.001 C 736 974.337 721.664 960.001 704 960.001 L 544 960.001 L 544 864.001 L 560.256 864.001 C 684.224 864.001 832 803.809 832 517.072 L 832 384 C 832 366.336 817.68 352 800 352 z" stroke-linecap="round" />
</g>
<g transform="matrix(8.89 0 0 8.94 540 557.56)" id="f99bf517-f254-4ccc-8267-a423f0699734"  >
<path style="stroke: rgb(0,0,0); stroke-width: 16; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(-50, -50)" d="M 50 92.875 C 26.358 92.875 7.125 73.642 7.125 50 C 7.125 26.358000000000004 26.358 7.125 50 7.125 C 73.642 7.125 92.875 26.358 92.875 50 C 92.875 73.642 73.642 92.875 50 92.875 z M 50 9.125 C 27.461 9.125 9.125 27.461 9.125 50 C 9.125 72.538 27.461 90.875 50 90.875 C 72.538 90.875 90.875 72.538 90.875 50 C 90.875 27.461 72.538 9.125 50 9.125 z" stroke-linecap="round" />
</g>
</svg>
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
