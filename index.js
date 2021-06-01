import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {Navigation} from 'react-native-navigation';
import SplashScreen from 'react-native-splash-screen';

import {setI18nConfig} from './app/locales';
import {setupOneSignal} from './app/onesignal';
import {loginRoot, mainRoot} from './app/navigation';
import auth from '@react-native-firebase/auth';

const isRegistered = () => {
  const me = auth().currentUser;
  return me && me.displayName;
};

Navigation.events().registerAppLaunchedListener(() => {
  setI18nConfig();
  setupOneSignal();
  Navigation.setRoot(isRegistered() ? mainRoot : loginRoot);
  SplashScreen.hide();
});
