import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity ,ImageBackground} from 'react-native';
import axios from 'axios';
import background from '../assets/bg.png';

const RecordingsList = ({ navigation,route }) => {
    const { userId } = route.params;
    const [recordings, setRecordings] = useState([]);

    useEffect(() => {
        fetchRecordings();
    }, []);

    const fetchRecordings = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/user/getrecs?userId=${userId}`);
            setRecordings(response.data);
        } catch (error) {
            console.error('Failed to fetch recordings:', error);
            // Handle error, perhaps show a message to the user
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.recordingItem}>
            {/* Display your recording data here. For example: */}
            <Text style={styles.recordingText}>Recording: {item.voiceNoteUrl}</Text>
            {/* You can add buttons or actions to play the recording if needed */}
        </View>
    );
    handleSumbitLogout = async () => {
            console.log("logout called");
            navigation.navigate('FirstScreen');
    };

    return (
        <View style={styles.container}>
            <FlatList 
                data={recordings}
                renderItem={renderItem}
                keyExtractor={item => item._id} // Assuming each recording has a unique _id
            />
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.imageBackground}
      >
         <FlatList 
                data={recordings}
                renderItem={renderItem}
                keyExtractor={item => item._id} // Assuming each recording has a unique _id
            />
        <View style={styles.content}>
          <TouchableOpacity style={styles.btn1}onPress={() => navigation.navigate('RegisterUser')}>
            <Text style={styles.btnText1}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
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
    recordingItem: {
        padding: 10,
        fontSize: 18,
        height: 44,
        width: '90%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordingText: {
        // Style for the recording text
    },
    btn1: {
      width: 250,
      height: 50,
      backgroundColor: 'white',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 10,
    },
    btnText1: {
      color: 'black',
      fontSize: 20,
      fontWeight: 'heavy',
    },
    imageBackground: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
});

export default RecordingsList;
