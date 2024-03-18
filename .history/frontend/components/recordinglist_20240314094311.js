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

    const renderItem = ({ item,index }) => (
        <View style={styles.recordingItem}>
            <Text style={styles.recordingText}>Recording {index + 1}: {item.textString}</Text>
        </View>
    );

    return (
        <ImageBackground
            source={background}
            resizeMode="cover"
            style={styles.container}>
            <View style={styles.listContainer}>
                <FlatList 
                    data={recordings}
                    renderItem={renderItem}
                    keyExtractor={item => item._id} // Assuming each recording has a unique _id
                />
            </View>
            {/* Button Container */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.btn1} onPress={() => navigation.navigate('FirstScreen')}>
                    <Text style={styles.btnText1}>Submit & Logout</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  listContainer: {
    flex: 1,
    marginTop: 100,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop:20, 
  },
  recordingItem: {
    padding: 10,
    fontSize: 18,
    height: 44,
    width: '90%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 5,
    backgroundColor:"grey",
  },
  btn1: {
    width: 250,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText1: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  recordingText: {
    color: 'white',
    fontSize: 20,
  },
});

export default RecordingsList;
