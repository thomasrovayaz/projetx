import OneSignal from 'react-native-onesignal';
import Config from 'react-native-config';
import {getMe, updateOneSignalId} from '../features/user/usersApi';
import {getMyEvents} from '../features/events/eventsApi';

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
      getMyEvents();
    },
  );
  const deviceState = await OneSignal.getDeviceState();
  console.log('deviceState', deviceState);
  const me = getMe();
  if (me) {
    await updateOneSignalId(deviceState.userId);
    OneSignal.sendTag('userId', me.uid);
  }
};
