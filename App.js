import {BackHandler, StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {themes} from './src/constants/themes';
import Routes from './src/routes/Routes';
import {AuthProvider} from './src/context/AuthContext';
// import {LogBox} from 'react-native';
import {StripeProvider} from '@stripe/stripe-react-native';
import messaging from '@react-native-firebase/messaging';
import {enableScreens} from 'react-native-screens';
import {ShowNotification} from './src/components/Notification';
import firebase from '@react-native-firebase/app';
enableScreens(true);
const App = () => {
  useEffect(() => {
    firebase.initializeApp();
  }, []);
  ///////////////////////////////
  // DISABLED DEVICE BACK BUTTON
  ///////////////////////////////
  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', function () {
  //     ToastAndroid.show('Click Left Arrow In The App', ToastAndroid.SHORT);
  //     return true;
  //   });
  // }, []);
  /////////////////////////
  // GET DEVICE TOKEN
  ////////////////////////
  const GetDeviceToken = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log(token);
  };
  ///////////////////////////////////
  // SEND NOTIFICATION FOR ALL DEVICE
  ///////////////////////////////////
  useEffect(() => {
    messaging()
      .subscribeToTopic('allDevices')
      .then(() => console.log('Subscribed to topic: allDevices'))
      .catch(error => console.log('Error subscribing to topic', error));
  }, []);
  ////////////////////////////
  // FORGROUND NOTIFICATIONS
  ////////////////////////////
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const image =
        remoteMessage?.notification?.android?.imageUrl.includes('undefined') ==
        true
          ? `https://media.istockphoto.com/id/501387734/photo/dancing-friends.jpg?b=1&s=612x612&w=0&k=20&c=MmbIgKebz8Y8JOJExdvLNemFhQNdBzTsgpYUBbZ6Fuc=`
          : remoteMessage?.notification?.android?.imageUrl;
      ShowNotification(
        remoteMessage?.notification?.title,
        remoteMessage?.notification?.body,
        image,
      );
    });
    return unsubscribe;
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={themes.colors.PRIMARY} />
      <AuthProvider>
        <StripeProvider publishableKey="pk_test_51M41d0EcdYnTqOgzUivsThB22QmMgpEfeNrVlIHZTMBuf1n07QBVySScqCcMZMTbs5i5duP3mdt3OW4xD4Y6Pf1H00GzxnwG1y">
          <Routes />
        </StripeProvider>
      </AuthProvider>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
