import React, { useEffect, useState,useRef } from 'react';
import {TouchableOpacity,Image,ImageBackground, View, Text, Button, StyleSheet, Alert, Platform ,TouchableHighlight, Animated, Easing} from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';
import { Svg, Path, Rect } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
import background from '../assets/buttonbg.png';

const Home = ({ navigation, route }) => {
  const [texts, setTexts] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const userId = route.params.userId;
  const count = route.params.count;
  const name = route.params.name;
  const email = route.params.email;

  const spinValue = useRef(new Animated.Value(0)).current;
  const spinValueopposite = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const spin = spinValue.interpolate({
    inputRange: [0, 1], 
    outputRange: ['0deg', '360deg'], 
  });
  const spinopposite = spinValueopposite.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });
  const translateY = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10], 
  });
  const startSpinning = () => {
    spinValue.setValue(0); 
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true, 
      })).start();
  };
  const startSpinningopposite = () => {
    spinValueopposite.setValue(0);
    Animated.loop(
      Animated.timing(spinValueopposite, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })).start();
  };
  const startMoving = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  const prepareSlideOut = () => {
    Animated.timing(slideAnim, {
      toValue: -100, 
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  const startSlideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  
  const stopSpinning = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue).stop();
    Animated.timing(spinValueopposite).stop();
  };
  const stopMoving = () => {
    moveAnim.setValue(0);
    Animated.timing(moveAnim).stop();
  };
  const prepareSlideIn = () => {
    slideAnim.setValue(-100); // Reset to start position off-screen
  };

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
    startSpinning()
    startSpinningopposite()
    startMoving()

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
    stopSpinning(); 
    stopMoving();
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
      prepareSlideIn(); 
      setCurrentTextIndex(currentTextIndex + 1); 
      startSlideIn(); 
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
          <Animated.Text style={[styles.text, { transform: [{ translateX: slideAnim }] }]}>
              {texts[currentTextIndex]?.text}
          </Animated.Text>
          <TouchableHighlight
          style={{ zIndex: 999,
            width:'100px',
            height:'100px' }}
          underlayColor="red"
            onPressIn={() => {
              startRecording();
            }}
            onPressOut={() => {
              stopRecordingAndUpload();
            }}
          >
            <View>
                {isRecording ? !isRecording : isRecording}
              <Animated.View style={{ transform: [{ translateY }] }}>
              <Svg style={styles.logo} fill="#000000" width="150" height="150" viewBox="0 0 1024 1024">
                    <Path d="M510.88 704h7.6C607.44 704 672 638.4 672 548.032V166.624C672 73.184 604.56 0 518.466 0h-7.584C423.264 0 352 74.752 352 166.624v381.408C352 636.944 420.304 704 510.88 704zM416 166.624C416 110.032 458.56 64 510.88 64h7.6C569.504 64 608 108.128 608 166.624v381.408C608 603.024 572.032 640 518.464 640h-7.584c-55.872 0-94.88-37.808-94.88-91.968zM800 352c-17.68 0-32 14.336-32 32v133.072c0 190.4-67.968 282.929-207.744 282.929H465.12c-182.8 0-209.12-153.84-209.12-282.928V384.001c0-17.664-14.336-32-32-32s-32 14.336-32 32v133.072c0 220.496 91.888 346.928 273.12 346.928H480v96H320c-17.664 0-32 14.336-32 32s14.336 32 32 32h384c17.664 0 32-14.336 32-32s-14.336-32-32-32H544v-96h16.256C684.224 864.001 832 803.809 832 517.072V384c0-17.664-14.32-32-32-32z" />
              </Svg>
              </Animated.View>
            </View>
            </TouchableHighlight>
        <View style={styles.overlaySvg1}>
          <Animated.View style={{ transform: [{ rotate : spinopposite }] }}>
          <Svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <Path d="M9 3.51221C5.50442 4.74772 3 8.08143 3 12.0001C3 16.9707 7.02944 21.0001 12 21.0001C16.9706 21.0001 21 16.9707 21 12.0001C21 8.08143 18.4956 4.74772 15 3.51221" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
             </Svg>
        </Animated.View>
        </View>
        <View style={styles.overlaySvg2}>
        <Animated.View style={{ transform: [{ rotate : spin }] }}>
          <Svg  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.8273 3 17.35 4.30367 19 6.34267" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
          </Svg>
        </Animated.View>
        </View>
        </View>
        
      )}
       <TouchableOpacity style={styles.logoutbtn} 
        onPress={handleLogout}
        >
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <Text style={styles.logouttext}>LOG OUT</Text>
      </ImageBackground>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      },
  text: {
    position  : 'absolute',
    fontSize: 30,
    margin: 20,
    color: 'black',
  },
  overlaySvg1: {
    zIndex: 2,
    width: 300,
    height: 300,
    top: 280,
    left: 50,
  },
  overlaySvg2: {
    zIndex: 2,
    width: 400,
    height: 400,
    bottom: 70,
  },
  logo: {
    position: 'absolute',
    left: 125,
    top: 350,
  },
  logoutbtn: {
    width: 250,
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
  },
  logouttext: {
    color: 'white',
    fontSize: 20,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
