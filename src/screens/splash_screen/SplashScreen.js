import React from 'react';
import {StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native';
import { themes } from '../../constants/themes';
 
const SplashScreen = () => {
  
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/512.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to BashPub</Text>
      <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themes.colors.TEXT_LIGHT,
    marginBottom: 20,
  },
  loader: {
    marginTop: 10,
  },
});
