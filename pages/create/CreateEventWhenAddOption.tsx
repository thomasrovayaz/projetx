import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NavigationFunctionComponent} from 'react-native-navigation';

const CreateEventWhenAddOptionScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
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
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

CreateEventWhenAddOptionScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: 'Add option',
    },
  },
  bottomTabs: {
    visible: false,
  },
};

export default CreateEventWhenAddOptionScreen;
