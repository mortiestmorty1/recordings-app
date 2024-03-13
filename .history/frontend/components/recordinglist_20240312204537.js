import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import axios from 'axios';

const RecordingsList = ({ navigation, route }) => {
  const [recordings, setRecordings] = useState([]);
  const { userId } = route.params.userId; // Ensure email is passed as a parameter

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user/getrecs', {
          params: {
            userId: userId // Use the email passed to the route
          }
        });
        setRecordings(response.data);
      } catch (error) {
        console.error("Error fetching recordings:", error);
        // Handle error (show alert or message indicating the error)
      }
    };

    fetchRecordings();
  }, [email]);

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'FirstScreen' }], // Make sure this is the correct name of your login or initial screen
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.recordingItem}>
      <Text>{item.name}</Text>
      {/* Display other recording details here */}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recordings}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id || index.toString()} // Assume each recording has a unique _id
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
