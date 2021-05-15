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
import Button from '../../components/Button';
import {translate} from '../../locales';

const CreateEventWhereScreen: NavigationFunctionComponent = ({componentId}) => {
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
          }}>
          <Button
            title="Next"
            onPress={() =>
              Navigation.push(componentId, {
                component: {
                  name: 'CreateEventWho',
                },
              })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

CreateEventWhereScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: translate('Où ?'),
    },
  },
  bottomTabs: {
    visible: false,
  },
};

export default CreateEventWhereScreen;
