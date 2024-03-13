import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import axios from 'axios';

const RecordingsList = ({ navigation, route }) => {
  const [recordings, setRecordings] = useState([]);
  const { userId } = route.params; // Correctly destructure userId

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/getrecs`, {
          params: { userId } // Assuming you have changed the backend to expect userId
        });
        setRecordings(response.data);

      } catch (error) {
        console.error("Error fetching recordings:", error);
        // Optionally handle the error, e.g., by setting an error state and displaying it
      }
    };
  
    if (userId) {
      fetchRecordings();
    }
  }, [userId]);
  
  

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'FirstScreen' }], // Adjust according to your actual login screen name
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.recordingItem}>
      <Text>{item.voiceNoteUrl}</Text>
      {/* Display other recording details here */}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recordings}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id || index.toString()}
      />
      <Button title="Submit & Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default RecordingsList;
