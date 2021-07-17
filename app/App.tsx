import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import HomeScreen from '../features/home';
import {useEffect} from 'react';
import {setI18nConfig, translate} from './locales';
import {setupOneSignal} from './onesignal';
import SplashScreen from 'react-native-splash-screen';
import EventListScreen from '../features/events/list';
import {persistor, store} from './store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';
import LoginScreen from '../features/user/Login';
import GroupsScreen from '../features/groups';
import BottomTabbar from '../common/BottomTabbar';
import EventScreen from '../features/events/details';
import EventParticipants from '../features/events/EventParticipants';
import CreateEventTypeScreen from '../features/events/create/CreateEventType';
import CreateEventWhatScreen from '../features/events/create/CreateEventWhat';
import CreateEventWhenScreen from '../features/events/create/CreateEventWhen';
import CreateEventWhoScreen from '../features/events/create/CreateEventWho';
import CreateEventWhereScreen from '../features/events/create/CreateEventWhere';
import CreateEventEndScreen from '../features/events/create/CreateEventEnd';
import DetailsGroupScreen from '../features/groups/DetailsGroup';
import CreateGroupScreen from '../features/groups/CreateGroup';
import QRCodeModal from '../common/QRCode';
import GroupMembersModal from '../features/groups/GroupMembers';
import TonightScreen from '../features/tonight';
import PollModal from '../features/polls/PollModal';
import CreatePollTypeScreen from '../features/polls/CreatePollType';
import CreatePollChoicesScreen from '../features/polls/CreatePollChoices';
import IconButton from '../common/IconButton';
import {StyleSheet} from 'react-native';
import SettingsScreen from '../features/user/Settings';
import {toastConfig} from '../common/Toast';

const isRegistered = () => {
  const me = auth().currentUser;
  return me && me.displayName;
};

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const PollStack = createStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator tabBar={props => <BottomTabbar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tonight" component={TonightScreen} />
      <Tab.Screen name="Events" component={EventListScreen} />
      <Tab.Screen name="Groups" component={GroupsScreen} />
    </Tab.Navigator>
  );
}
function MainStackScreen() {
  return (
    <MainStack.Navigator initialRouteName={isRegistered() ? 'Home' : 'Login'}>
      <MainStack.Screen
        options={{headerShown: false}}
        name="Login"
        component={LoginScreen}
      />
      <MainStack.Screen
        name="Home"
        options={({navigation}) => ({
          headerTransparent: true,
          headerTitle: '',
          headerLeft: undefined,
          headerRight: () => (
            <IconButton
              size={25}
              style={styles.headerButton}
              name={'settings'}
              onPress={() => navigation.navigate('Settings')}
            />
          ),
        })}
        component={HomeTabs}
      />
      <MainStack.Screen
        name="Settings"
        options={{headerShown: false}}
        component={SettingsScreen}
      />
      <MainStack.Screen
        name="Event"
        options={{headerShown: false}}
        component={EventScreen}
      />
      <MainStack.Screen
        options={{
          headerShown: false,
        }}
        name="CreateEventType"
        initialParams={{
          title: translate('Quoi ?'),
        }}
        component={CreateEventTypeScreen}
      />
      <MainStack.Screen
        options={{headerShown: false}}
        name="CreateEventWhat"
        initialParams={{
          title: translate('Détails'),
        }}
        component={CreateEventWhatScreen}
      />
      <MainStack.Screen
        options={{headerShown: false}}
        name="CreateEventWhen"
        initialParams={{
          title: translate('Quand ?'),
        }}
        component={CreateEventWhenScreen}
      />
      <MainStack.Screen
        options={{headerShown: false}}
        name="CreateEventWho"
        initialParams={{
          title: translate('Qui ?'),
        }}
        component={CreateEventWhoScreen}
      />
      <MainStack.Screen
        options={{headerShown: false}}
        name="CreateEventWhere"
        initialParams={{
          title: translate('Où ?'),
        }}
        component={CreateEventWhereScreen}
      />
      <MainStack.Screen
        options={{headerShown: false}}
        name="CreateEventEnd"
        component={CreateEventEndScreen}
      />
      <MainStack.Screen
        name="DetailsGroupScreen"
        options={{headerShown: false}}
        initialParams={{
          title: translate('Groupe'),
        }}
        component={DetailsGroupScreen}
      />
      <MainStack.Screen
        name="CreateGroupScreen"
        options={{headerShown: false}}
        component={CreateGroupScreen}
      />
    </MainStack.Navigator>
  );
}

function CreatePollScreen() {
  return (
    <PollStack.Navigator screenOptions={{headerShown: false}}>
      <PollStack.Screen
        name="CreatePollType"
        component={CreatePollTypeScreen}
      />
      <PollStack.Screen
        name="CreatePollChoices"
        component={CreatePollChoicesScreen}
      />
    </PollStack.Navigator>
  );
}

const App = () => {
  useEffect(() => {
    setI18nConfig();
    setupOneSignal();
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <RootStack.Navigator
              mode="modal"
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                cardOverlayEnabled: true,
                ...TransitionPresets.ModalPresentationIOS,
              }}>
              <RootStack.Screen
                name="Main"
                component={MainStackScreen}
                options={{headerShown: false}}
              />
              <RootStack.Screen
                name="EventParticipants"
                component={EventParticipants}
              />
              <RootStack.Screen
                name="GroupMembers"
                component={GroupMembersModal}
              />
              <RootStack.Screen name="QRCode" component={QRCodeModal} />
              <RootStack.Screen name="Poll" component={PollModal} />
              <RootStack.Screen
                name="CreatePoll"
                component={CreatePollScreen}
              />
            </RootStack.Navigator>
            <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    padding: 10,
    paddingHorizontal: 20,
  },
});

export default App;