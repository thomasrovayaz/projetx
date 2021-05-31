import OneSignal from 'react-native-onesignal';
import Config from 'react-native-config';
import {getMe, updateOneSignalId} from '../features/user/usersApi';

export const setupOneSignal = async () => {
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId(Config.ONESIGNAL_API_KEY);
  const deviceState = await OneSignal.getDeviceState();
  console.log('deviceState', deviceState);
  const me = getMe();
  if (me) {
    await updateOneSignalId(deviceState.userId);
    OneSignal.sendTag('userId', me.uid);
  }
};
