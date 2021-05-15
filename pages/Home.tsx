import React, {useEffect, useReducer} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  ViewStyle,
} from 'react-native';
import database from '@react-native-firebase/database';
import * as RNLocalize from 'react-native-localize';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {setI18nConfig, translate} from '../locales';
import Button from '../components/Button';
import Title from '../components/Title';
import Icon from 'react-native-vector-icons/Feather';
import useTabbarIcon from '../utils/useTabbarIcon';

const HomeScreen: NavigationFunctionComponent = ({
  componentId,
}: {
  componentId: string;
}) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  useTabbarIcon(componentId, 'home');

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

  useEffect(() => {
    const setupTabBarIcon = async () => {
      Navigation.mergeOptions(componentId, {
        bottomTab: {
          icon: await Icon.getImageSource('home', 30, '#ffffff'),
        },
      });
    };

    setupTabBarIcon();
  }, [componentId]);

  const containerStyle: ViewStyle = {
    flex: 1,
  };
  const contentStyle: ViewStyle = {
    padding: 20,
    alignItems: 'stretch',
  };
  const itemStyle: ViewStyle = {
    marginTop: 20,
    marginBottom: 20,
  };

  database()
    .ref('events')
    .once('value')
    .then(snapshot => {
      console.log('User data: ', snapshot.val());
    })
    .catch(console.log);

  return (
    <SafeAreaView style={containerStyle}>
      <StatusBar />
      <ScrollView
        contentInsetAdjustmentBehavior="always"
        style={containerStyle}>
        <View style={contentStyle}>
          <Title>{translate('Mes événements')}</Title>
          <Button
            title="Open event"
            variant="outlined"
            style={itemStyle}
            onPress={() =>
              Navigation.push(componentId, {
                component: {
                  name: 'Event',
                },
              })
            }
          />
          <Button
            title="Créer un événement"
            style={itemStyle}
            onPress={() =>
              Navigation.push(componentId, {
                component: {
                  name: 'CreateEventType',
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
};

export default HomeScreen;
