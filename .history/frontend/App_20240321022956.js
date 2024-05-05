import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FirstScreen from './components/firstscreen'; 
import RegisterUser from './components/registerUser';
import Revisit from './components/revisit';
import  Home from './components/home';
import TermsAndConditionsScreen from './components/termsandconditions';
import RecordingsList from './components/recordinglist';
import RecordingScreen from './components/recording';
const Stack = createStackNavigator();

function App() {
  return (
    <View style={styles.container}>
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          name="FirstScreen"
          component={FirstScreen}
          options={{ headerShown: false }} 
        />
      <Stack.Screen 
        name="RegisterUser" 
        component={RegisterUser}
        options={{
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerBackTitleVisible: false,
      }}
      />
      <Stack.Screen 
        name="Revisit" 
        component={Revisit}
        options={{
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerBackTitleVisible: false,
      }}
    />
        <Stack.Screen 
        name="Home" 
        component={Home}
        options={{ headerShown: false }}  />
        <Stack.Screen 
        name="TermsAndConditions" 
        component={TermsAndConditionsScreen} />
        <Stack.Screen 
        name="RecordingsList" 
        component={RecordingsList}
        options={{ headerShown: false }}  />
        <Stack.Screen
        name="Recording"
        component={RecordingScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerBackTitleVisible: false,
        }}  />
      </Stack.Navigator>
    </NavigationContainer>
    <StatusBar style="auto" />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});
export default App;
