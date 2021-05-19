import React, {useEffect, useReducer} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {setI18nConfig, translate} from '../locales';
import Button from '../components/Button';
import Title from '../components/Title';
import useTabbarIcon from '../utils/useTabbarIcon';
import EventsList from '../components/EventsList';
import {ProjetXEvent} from '../api/Events';
import auth from '@react-native-firebase/auth';

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
    if (!auth().currentUser) {
      auth().signInAnonymously();
    }
    console.log(auth().currentUser);
    setI18nConfig();
    RNLocalize.addEventListener('change', handleLocalizationChange);
    return () => {
      RNLocalize.removeEventListener('change', handleLocalizationChange);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Title style={styles.title}>{translate('Mes événements')}</Title>
      <EventsList
        onOpenEvent={(event: ProjetXEvent) => {
          Navigation.push(componentId, {
            component: {
              name: 'Event',
              passProps: {
                event,
              },
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
