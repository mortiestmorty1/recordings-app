import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const Home = ({ navigation }) => {
  const [texts, setTexts] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    fetchTexts();
  }, []);

  const fetchTexts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/text/getTexts');
      setTexts(response.data.message); // Assuming the response contains an array of texts
    } catch (error) {
      console.error('Failed to fetch texts:', error);
    }
  };

  const handleNextText = () => {
    if (currentTextIndex < texts.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1);
    } else {
      alert('You have completed all texts!');
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
          <Text>{texts[currentTextIndex].text}</Text>
          <Button title="Next Text" onPress={handleNextText} />
        </View>
      )}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

// Add your styles


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Add other styles if needed
});

export default Home;
