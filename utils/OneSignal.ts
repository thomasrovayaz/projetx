import OneSignal from 'react-native-onesignal';
import Config from 'react-native-config';
import {Alert} from 'react-native';

export const setupOneSignal = async () => {
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId(Config.ONESIGNAL_API_KEY);

  OneSignal.promptForPushNotificationsWithUserResponse(response => {
    console.log('Prompt response:', response);
  });
  OneSignal.setNotificationWillShowInForegroundHandler(
    notificationReceivedEvent => {
      console.log(
        'OneSignal: notification will show in foreground:',
        notificationReceivedEvent,
      );
      let notification = notificationReceivedEvent.getNotification();
      console.log('notification: ', notification);
      const data = notification.additionalData;
      console.log('additionalData: ', data);
      const button1 = {
        text: 'Cancel',
        onPress: () => {
          notificationReceivedEvent.complete();
        },
        style: 'cancel',
      };
      const button2 = {
        text: 'Complete',
        onPress: () => {
          notificationReceivedEvent.complete(notification);
        },
      };
      Alert.alert('Complete notification?', 'Test', [button1, button2], {
        cancelable: true,
      });
    },
  );

  OneSignal.setNotificationOpenedHandler(notification => {
    console.log('OneSignal: notification opened:', notification);
  });
  const deviceState = await OneSignal.getDeviceState();
  console.log(deviceState);
};
