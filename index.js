import 'react-native-gesture-handler';
import 'react-native-reanimated';
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {PaperProvider} from 'react-native-paper';
// import { Settings } from 'react-native-fbsdk-next';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
// Handle background notifications
notifee.onBackgroundEvent(async ({type, detail}) => {
  console.log('Background event type: ', type);
  console.log('Notification details: ', detail);
});
////////////////////////////
// BACKGROUND NOTIFICATIONS
////////////////////////////
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('background mode');
});
///////////////////////////////////
// KILL STATE MODE NOTIFICATIONS
//////////////////////////////////
messaging().getInitialNotification(async remoteMessage => {
  console.log('kill state mode');
});
// Settings.initializeSDK();
export default function Main() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
