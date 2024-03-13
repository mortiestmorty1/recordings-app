import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity ,ImageBackground} from 'react-native';
import axios from 'axios';
import background from '../assets/background.png';

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
      <TouchableOpacity style={styles.logoutbtn} 
        onPress={handleSumbitLogout}
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

export default RecordingsList;
