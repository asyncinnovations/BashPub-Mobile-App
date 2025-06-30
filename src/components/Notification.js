import notifee, {AndroidImportance, AndroidStyle} from '@notifee/react-native';

const ShowNotification = async (title, message, imageUrl) => {
  await notifee.requestPermission();
  const timestamp = new Date().toLocaleString();
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    sound: 'notifee_sound', 
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: `${title}`,
    body: `${message}`,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
      sound: 'notifee_sound', // Use the default sound
      vibrationPattern: [300, 500],
      ongoing: false,
      autoCancel: true,
      color: '#4caf50',
      style: {type: AndroidStyle.BIGPICTURE, picture: imageUrl},
    },
    subtitle: `BashPub ${timestamp}`,
  });
};
 

export {ShowNotification};
