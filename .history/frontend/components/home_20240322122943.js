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
  const name = route.params.name;
  const email = route.params.email;
  const [startSound, setStartSound] = useState();
  const [endSound, setEndSound] = useState();
  const [recordStartTime, setRecordStartTime] = useState(0);
  const [recordDuration, setRecordDuration] = useState(0);
  const [isLastText, setIsLastText] = useState(false);
  const [lastRecordingUri, setLastRecordingUri] = useState(null);



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
    slideAnim.setValue(-100); 
  };
  const loadSounds = async () => {
    const { sound: startSound } = await Audio.Sound.createAsync(
      require('../assets/start.mp3') 
    );
    setStartSound(startSound);
  
    const { sound: endSound } = await Audio.Sound.createAsync(
      require('../assets/end.mp3') 
    );
    setEndSound(endSound);
  };
  useEffect(() => {
    loadSounds();
    return () => {
      if (startSound) {
        startSound.unloadAsync();
      }
      if (endSound) {
        endSound.unloadAsync();
      }
    };
  }, []);
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
        await startSound.replayAsync();
        setTimeout(async () => {
            startSpinning();
            startSpinningopposite();
            startMoving();
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
                setRecordStartTime(Date.now());
            } catch (err) {
                console.error('Failed to start recording:', err);
                Alert.alert("Error", "Failed to start recording. Please try again.");
            }
        }, 1000);
    } catch (error) {
        console.error('Failed to play start sound:', error);
    }
};


const stopRecordingAndUpload = async () => {
  if (!recording) {
    console.log("No active recording to stop.");
    return;
  }
  stopSpinning();
  stopMoving();
  if (recording._finalDurationMillis === undefined) {
    console.log("Recording has already been stopped and unloaded.");
    return;
  }
  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    await endSound.replayAsync();
    setRecording(null);
    setIsRecording(false);
    const endTime = Date.now();
    const duration = (endTime - recordStartTime) / 1000;
    setRecordDuration(duration);
    console.log('Recording duration:', duration);

    if (duration < 3) {
      Alert.alert("Recording Too Short", "Please record again. Recording should be longer than 3 seconds.");
      if (uri) {
        await FileSystem.deleteAsync(uri);
      }
      return;
    }
    setLastRecordingUri(uri);
  } catch (error) {
    console.error("Error stopping recording:", error);
    Alert.alert("Error", "Failed to stop the recording. Please try again.");
  }
};
  const recordAgain = async () => {
    if (recording) {
        await stopRecording();
        const uri = recording.getURI();
        if (uri) {
            await FileSystem.deleteAsync(uri);
        }
        setRecording(null);
        setIsRecording(false);
    }

    await startRecording();
};

const nextOrFinish = async () => {
  if (!lastRecordingUri) {
      Alert.alert("No recording", "Please record something first.");
      return;
  }
  await uploadRecording(lastRecordingUri);

  if (currentTextIndex === texts.length - 1) {
      console.log('Finish');
      navigation.navigate('RecordingsList', {
          userId: userId,
          name: name,
          email: email,
      });
  } else {
      setCurrentTextIndex(currentTextIndex + 1);
      setIsLastText(currentTextIndex + 1 === texts.length - 1);
      setLastRecordingUri(null);
  }
};

useEffect(() => {
    setIsLastText(currentTextIndex === texts.length - 1);
}, [currentTextIndex, texts.length]);


const uploadRecording = async (uri) => {
  const fileType = 'audio/mp3';
  const fileName = `recording_${Date.now()}_${name}_TextID_${texts[currentTextIndex]._id}.mp3`;

  
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('textId', texts[currentTextIndex]._id);
  formData.append('textString', texts[currentTextIndex].text);
  formData.append('audio', {
      uri: uri,
      name: fileName,
      type: fileType,
  });
  const backendUrl = Platform.OS === 'android'
      ? 'http://10.0.2.2:3001/recordings/createRecordings' 
      : 'http://localhost:3001/recordings/createRecordings'; 

  try {
      const response = await axios.post(backendUrl, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      console.log('Upload successful:', response.data);
      handleNextText(); // Proceed to the next action after successful upload
  } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert("Upload Failed", `An error occurred: ${error.message}`);
  }

  // Cleanup after upload
  await FileSystem.deleteAsync(uri, { idempotent: true });
};

  const fetchTexts = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3001/text/getall');
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
      console.log("Navigating to RecordingsList", userId, name, email);
      navigation.navigate('RecordingsList', {
        userId: userId,
        name: name,
        email: email,
      });
    }
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'FirstScreen' }],
    });
  };
  const toggleRecording = async () => {
    if (isRecording) {
        await stopRecordingAndUpload();
    } else {
        await startRecording();
    }
};


  return (
    <View style={styles.container}>
      {texts.length > 0 && (
        <View>
          <Text style={styles.instructions}>
          Press the mic icon to start recording. Press again to stop and upload the recording.
          you can also record again or move to the next recording.
        </Text>
          <Animated.Text style={[styles.text, { transform: [{ translateX: slideAnim }] }]}>
              {texts[currentTextIndex]?.text}
          </Animated.Text>
          <View style={styles.press}>
          <TouchableOpacity
          style={{ zIndex: 3,
            width:'100px',
            height:'100px' }}
          underlayColor="red"
            onPress={toggleRecording}
          >
            <View>
                {isRecording ? !isRecording : isRecording}
              <Animated.View style={{ transform: [{ translateY }] }}>
              <Svg style={styles.logo} fill="#000000" width="150" height="150" viewBox="0 0 1024 1024">
                    <Path d="M510.88 704h7.6C607.44 704 672 638.4 672 548.032V166.624C672 73.184 604.56 0 518.466 0h-7.584C423.264 0 352 74.752 352 166.624v381.408C352 636.944 420.304 704 510.88 704zM416 166.624C416 110.032 458.56 64 510.88 64h7.6C569.504 64 608 108.128 608 166.624v381.408C608 603.024 572.032 640 518.464 640h-7.584c-55.872 0-94.88-37.808-94.88-91.968zM800 352c-17.68 0-32 14.336-32 32v133.072c0 190.4-67.968 282.929-207.744 282.929H465.12c-182.8 0-209.12-153.84-209.12-282.928V384.001c0-17.664-14.336-32-32-32s-32 14.336-32 32v133.072c0 220.496 91.888 346.928 273.12 346.928H480v96H320c-17.664 0-32 14.336-32 32s14.336 32 32 32h384c17.664 0 32-14.336 32-32s-14.336-32-32-32H544v-96h16.256C684.224 864.001 832 803.809 832 517.072V384c0-17.664-14.32-32-32-32z" />
              </Svg>
              </Animated.View>
            </View>
            </TouchableOpacity>
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
        </View> 
      )}
   <View style={styles.actionContainer}>
  
    <View style={styles.buttonsContainer}>
   
      <TouchableOpacity onPress={recordAgain} style={[styles.actionButton, styles.firstButton]}>
      <ImageBackground source={background} resizeMode="cover" style={styles.imageBackground}>
        <Text style={styles.buttonText}>Record Again</Text>
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity onPress={nextOrFinish} style={[styles.actionButton, styles.secondButton]}>
      <ImageBackground source={background} resizeMode="cover" style={styles.imageBackground}>
        <Text style={styles.buttonText}>{isLastText ? "Finish" : "Next Recording"}</Text>
        </ImageBackground>
      </TouchableOpacity>

    </View>
    </View>
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
    fontSize: 30,
    margin: 20,
    color: 'black',
    top: 130
  },
  press: {
    width: '100%',
    bottom: 30,
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
    bottom: 120,
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
  instructions: {
    textAlign: 'center',
    color: '#808080',
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
    top: 140,
  },
  actionContainer: {
    bottom: 100,
    width: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 10,
  },
  actionButton: {
    width: 150,
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
  },
  firstButton: {
    marginRight: 10,
  },
  secondButton: {
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },

});

export default Home;
