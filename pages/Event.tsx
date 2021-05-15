import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';

const EventScreen: NavigationFunctionComponent = ({componentId}) => {
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
          <Button
            title="Register"
            color="#710ce3"
            onPress={() => showModal('Register')}
          />
          <Button
            title="Show poll"
            color="#710ce3"
            onPress={() => showModal('Poll')}
          />
          <Button
            title="Show participants"
            color="#710ce3"
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
