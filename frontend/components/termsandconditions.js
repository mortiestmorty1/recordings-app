import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

const TermsAndConditionsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>EchoCollect</Text>
      <Text style={styles.subtitle}>Terms and Conditions for EchoCollect</Text>
      <Text style={styles.date}>Last Updated: 09/03/2024</Text>
      <View style={styles.content}>
        <Text style={styles.paragraph}>
          Welcome to EchoCollect, a voice data collection platform ("the App") developed and maintained by Shoaib Ahmed, Zimal, Mahrukh, and the Final Year Project team, located in Pakistan ("we," "us," or "our"). By accessing or using the App, you agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of the Terms, you may not access the App.
        </Text>
        <Text style={styles.header}>1. Use of the App</Text>
        <Text style={styles.paragraph}>
          * The App is intended for users to contribute voice recordings for data collection purposes.{'\n'}
          * Users must be 18 years or older or have parental consent to use the App.{'\n'}
          * The App should not be used for any illegal or unauthorized purpose.
        </Text>
        <Text style={styles.header}>2. Content</Text>
        <Text style={styles.paragraph}>
          * Users retain ownership of the voice recordings they contribute to the App. However, by submitting recordings, users grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display these recordings for data analysis and other related purposes.{'\n'}
          * Users are responsible for ensuring they have all necessary rights and permissions to submit recordings to the App.
        </Text>
        <Text style={styles.header}>3. Privacy</Text>
        <Text style={styles.paragraph}>
          * We are committed to protecting your privacy. Our Privacy Policy, which is part of these Terms, outlines how we collect, use, and protect your data.
        </Text>
        <Text style={styles.header}>4. Disclaimer and Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          * The App is provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all warranties, express or implied, including the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.{'\n'}
          * In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising out of or in connection with your use of the App.
        </Text>
        <Text style={styles.header}>5. Governing Law</Text>
        <Text style={styles.paragraph}>
          * These Terms shall be governed and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions.
        </Text>
        <Text style={styles.header}>6. Contact Us</Text>
        <Text style={styles.paragraph}>
          * If you have any questions about these Terms, please contact us at: Shoaib.sohoo123@gmail.com.
        </Text>
        <Text style={styles.paragraph}>
          By using EchoCollect, you acknowledge that you have read and understood these Terms and agree to be bound by them.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    marginBottom: 10,
  },
  content: {
    marginTop: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  paragraph: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default TermsAndConditionsScreen;
