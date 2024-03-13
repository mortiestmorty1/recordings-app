import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import background from '../assets/bg.png';

const RecordingsList = ({ navigation, route }) => {
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
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.recordingItem}>
            <Text style={styles.recordingText}>Recording: {item.voiceNoteUrl}</Text>
        </View>
    );

    return (
        <ImageBackground
            source={background}
            resizeMode="cover"
            style={styles.container}>
            <FlatList 
                data={recordings}
                renderItem={renderItem}
                keyExtractor={item => item._id} // Assuming each recording has a unique _id
                contentContainerStyle={{ paddingBottom: 60 }} // Adjust padding to make space for the button
            />
            <TouchableOpacity style={styles.btn1} onPress={() => navigation.navigate('FirstScreen')}>
                <Text style={styles.btnText1}>Get Started</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center', // Adjusted for the ImageBackground
  },
  recordingItem: {
    top: 100,
    backgroundColor: 'white',
    padding: 10,
    fontSize: 18,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderWidth: 1,
    width: 500,
  },
  btn1: {
    width: 250,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // Positioned absolutely
    bottom: 10, // Adjusted to ensure visibility
  },
  btnText1: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold', // 'heavy' is not a valid value for fontWeight in React Native
  },
});

export default RecordingsList;
