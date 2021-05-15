/**
 * @format
 */

import 'react-native-gesture-handler';
import {Navigation} from 'react-native-navigation';
import HomeScreen from './pages/Home';
import SettingsScreen from './pages/Settings';

import EventScreen from './pages/Event';
import RegisterModal from './pages/Register';
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

Navigation.registerComponent('Home', () => HomeScreen);
Navigation.registerComponent('Settings', () => SettingsScreen);

Navigation.registerComponent('Event', () => EventScreen);
Navigation.registerComponent('Register', () => RegisterModal);
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

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
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
  });
});
