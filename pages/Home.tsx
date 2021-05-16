import React, {useEffect, useReducer} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {setI18nConfig, translate} from '../locales';
import Button from '../components/Button';
import Title from '../components/Title';
import Icon from 'react-native-vector-icons/Feather';
import useTabbarIcon from '../utils/useTabbarIcon';
import EventsList from '../components/EventsList';
import {Event} from '../api/Events';

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Title style={styles.title}>{translate('Mes événements')}</Title>
      <EventsList
        onOpenEvent={(event: Event) => {
          Navigation.push(componentId, {
            component: {
              name: 'Event',
            },
          });
        }}
      />
      <View style={styles.buttonCreate}>
        <Button
          title="Créer un événement"
          onPress={() =>
            Navigation.push(componentId, {
              component: {
                name: 'CreateEventType',
              },
            })
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    margin: 20,
  },
  buttonCreate: {
    padding: 20,
    height: 90,
  },
});

HomeScreen.options = {
  topBar: {
    visible: false,
  },
};

export default HomeScreen;
