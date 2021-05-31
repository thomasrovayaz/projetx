import React from 'react';
import {Navigation} from 'react-native-navigation';
import CreateEventEndScreen from '../features/events/create/CreateEventEnd';
import CreateEventWhatScreen from '../features/events/create/CreateEventWhat';
import CreateEventWhoScreen from '../features/events/create/CreateEventWho';
import CreateEventWhereScreen from '../features/events/create/CreateEventWhere';
import CreateEventWhenPollSettingsScreen from '../features/events/create/CreateEventWhenPollSettings';
import CreateEventWhenAddOptionScreen from '../features/events/create/CreateEventWhenAddOption';
import CreateEventWhenScreen from '../features/events/create/CreateEventWhen';
import CreateEventTypeScreen from '../features/events/create/CreateEventType';
import ParticipantsModal from '../features/events/Participants';
import PollModal from '../features/polls/Poll';
import EventScreen from '../features/events/details';
import SettingsScreen from '../features/user/Settings';
import HomeScreen from '../features/events/list';
import LoginScreen from '../features/user/Login';
import {Provider} from 'react-redux';
import {persistor, store} from './store';
import {PersistGate} from 'redux-persist/integration/react';

function registerScreen<P>(name: string, Component: React.ComponentType<P>) {
  Navigation.registerComponent(
    name,
    () => props => {
      return (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Component {...props} />
          </PersistGate>
        </Provider>
      );
    },
    () => Component,
  );
}

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
registerScreen('Login', LoginScreen);

registerScreen('Home', HomeScreen);
registerScreen('Settings', SettingsScreen);

registerScreen('Event', EventScreen);
registerScreen('Poll', PollModal);
registerScreen('Participants', ParticipantsModal);

registerScreen('CreateEventType', CreateEventTypeScreen);
registerScreen('CreateEventWhen', CreateEventWhenScreen);
registerScreen('CreateEventWhenAddOption', CreateEventWhenAddOptionScreen);
registerScreen(
  'CreateEventWhenPollSettings',
  CreateEventWhenPollSettingsScreen,
);
registerScreen('CreateEventWhere', CreateEventWhereScreen);
registerScreen('CreateEventWho', CreateEventWhoScreen);
registerScreen('CreateEventWhat', CreateEventWhatScreen);
registerScreen('CreateEventEnd', CreateEventEndScreen);

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
