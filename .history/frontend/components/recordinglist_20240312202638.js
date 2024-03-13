import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';

const RecordingsList = ({ navigation, route }) => {
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    // Fetch recordings from your backend or local storage
    // For now, let's assume we're fetching them from local storage or state passed via navigation
    const fetchRecordings = async () => {
      // Your fetch logic here
      // setRecordings(fetchedRecordings);
    };

    fetchRecordings();
  }, []);

  const handleLogout = () => {
    // Your logout logic here
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }], // Replace 'LoginScreen' with the actual name of your login screen
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
        keyExtractor={(item, index) => item.id || index.toString()}
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
