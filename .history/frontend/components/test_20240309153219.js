import React, { useEffect } from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

const MyComponent = () => {

  let runAnimation;
  useEffect(() => {
    runAnimation.play();
  }, []);
  return (
    <View style={styles.container}>
      <LottieView
        ref={(animation) =>{
          runAnimation = animation;
        }}
        source={require('../assets/micstart.json')}
        autoPlay={true}
        loop={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyComponent;