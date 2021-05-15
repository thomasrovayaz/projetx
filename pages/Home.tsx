import React, {useEffect, useReducer} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import database from '@react-native-firebase/database';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import * as RNLocalize from 'react-native-localize';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {setI18nConfig, translate} from '../locales';

const HomeScreen: NavigationFunctionComponent = ({
  componentId,
}: {
  componentId: string;
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleLocalizationChange = () => {
    setI18nConfig();
    forceUpdate();
  };

  useEffect(() => {
    setI18nConfig();
    RNLocalize.addEventListener('change', handleLocalizationChange);
    return () => {
      RNLocalize.removeEventListener('change', handleLocalizationChange);
    };
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  database()
    .ref('events')
    .once('value')
    .then(snapshot => {
      console.log('User data: ', snapshot.val());
    })
    .catch(console.log);

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
          <Text>{translate('hello')}</Text>
          <Button
            title="Create event"
            color="#710ce3"
            onPress={() =>
              Navigation.push(componentId, {
                component: {
                  name: 'CreateEventType',
                },
              })
            }
          />
          <Button
            title="Open event"
            color="#710ce3"
            onPress={() =>
              Navigation.push(componentId, {
                component: {
                  name: 'Event',
                },
              })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

HomeScreen.options = {
  topBar: {
    visible: false,
  },
  bottomTab: {
    text: 'Home',
  },
};

export default HomeScreen;
