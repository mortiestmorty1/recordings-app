import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Button } from 'react-native';

const ConsentForm = ({ onSubmit }) => {
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  const toggleSwitch = () => setIsConsentGiven(previousState => !previousState);

  const handleSubmit = () => {
    if (isConsentGiven) {
      // Call the onSubmit prop with the consent value
      onSubmit(isConsentGiven);
    } else {
      alert('Please give your consent to proceed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>I consent to the terms and conditions.</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isConsentGiven ? "#f5dd4b" : "#f4f3f4"}
        onValueChange={toggleSwitch}
        value={isConsentGiven}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginBottom: 10,
  },
});

export default ConsentForm;
