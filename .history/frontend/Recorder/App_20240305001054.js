import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ConsentForm from './components/consentpage.js';

export default function App() {
  const handleConsentSubmit = (consent) => {
    console.log('Consent given:', consent);
    // Here you can handle the consent, e.g., navigate to another screen
  };
  return (
    <View style={styles.container}>
      <ConsentForm onSubmit={handleConsentSubmit} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
