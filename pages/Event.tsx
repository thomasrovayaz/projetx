import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../components/Button';

const EventScreen: NavigationFunctionComponent = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const showModal = (id: string) => {
    return Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: id,
            },
          },
        ],
      },
    });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button title="Register" onPress={() => showModal('Register')} />
          <Button title="Show poll" onPress={() => showModal('Poll')} />
          <Button
            title="Show participants"
            onPress={() => showModal('Participants')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

EventScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: 'Event',
    },
  },
  bottomTabs: {
    visible: false,
  },
};

export default EventScreen;
