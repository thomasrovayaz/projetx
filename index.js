import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {Navigation} from 'react-native-navigation';
import SplashScreen from 'react-native-splash-screen';

import HomeScreen from './pages/Home';
import SettingsScreen from './pages/Settings';

import EventScreen from './pages/Event';
import PollModal from './pages/Poll';
import ParticipantsModal from './pages/Participants';

import CreateEventTypeScreen from './pages/create/CreateEventType';
import CreateEventWhenScreen from './pages/create/CreateEventWhen';
import CreateEventWhenAddOptionScreen from './pages/create/CreateEventWhenAddOption';
import CreateEventWhenPollSettingsScreen from './pages/create/CreateEventWhenPollSettings';
import CreateEventWhereScreen from './pages/create/CreateEventWhere';
import CreateEventWhoScreen from './pages/create/CreateEventWho';
import CreateEventWhatScreen from './pages/create/CreateEventWhat';
import CreateEventEndScreen from './pages/create/CreateEventEnd';
import LoginScreen from './pages/Login';
import {getMe} from './api/Users';
import {setI18nConfig} from './locales';
import {setupOneSignal} from './utils/OneSignal';

Navigation.setDefaultOptions({
  statusBar: {
    backgroundColor: '#473B78',
  },
  topBar: {
    title: {
      fontFamily: 'Inter',
      color: 'white',
    },
    backButton: {
      color: 'white',
    },
    background: {
      color: '#473B78',
    },
  },
  bottomTab: {
    fontSize: 14,
    fontFamily: 'Inter',
    selectedFontSize: 14,
    iconColor: 'white',
    selectedIconColor: '#E6941B',
    textColor: 'white',
    selectedTextColor: '#E6941B',
  },
  bottomTabs: {
    backgroundColor: '#473B78',
    titleDisplayMode: 'alwaysHide',
  },
});
Navigation.registerComponent('Login', () => LoginScreen);

Navigation.registerComponent('Home', () => HomeScreen);
Navigation.registerComponent('Settings', () => SettingsScreen);

Navigation.registerComponent('Event', () => EventScreen);
Navigation.registerComponent('Poll', () => PollModal);
Navigation.registerComponent('Participants', () => ParticipantsModal);

Navigation.registerComponent('CreateEventType', () => CreateEventTypeScreen);
Navigation.registerComponent('CreateEventWhen', () => CreateEventWhenScreen);
Navigation.registerComponent(
  'CreateEventWhenAddOption',
  () => CreateEventWhenAddOptionScreen,
);
Navigation.registerComponent(
  'CreateEventWhenPollSettings',
  () => CreateEventWhenPollSettingsScreen,
);
Navigation.registerComponent('CreateEventWhere', () => CreateEventWhereScreen);
Navigation.registerComponent('CreateEventWho', () => CreateEventWhoScreen);
Navigation.registerComponent('CreateEventWhat', () => CreateEventWhatScreen);
Navigation.registerComponent('CreateEventEnd', () => CreateEventEndScreen);

export const loginRoot = {
  root: {
    component: {
      name: 'Login',
    },
  },
};

export const mainRoot = {
  root: {
    bottomTabs: {
      children: [
        {
          stack: {
            children: [
              {
                component: {
                  name: 'Home',
                },
              },
            ],
          },
        },
        {
          stack: {
            children: [
              {
                component: {
                  name: 'Settings',
                },
              },
            ],
          },
        },
      ],
    },
  },
};

const isRegistered = () => {
  return getMe()?.displayName;
};

Navigation.events().registerAppLaunchedListener(() => {
  setI18nConfig();
  setupOneSignal();
  Navigation.setRoot(isRegistered() ? mainRoot : loginRoot);
  SplashScreen.hide();
});
