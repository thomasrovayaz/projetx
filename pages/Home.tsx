import React, {useEffect, useReducer} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {setI18nConfig, translate} from '../locales';
import Button from '../components/Button';
import Title from '../components/Title';
import useTabbarIcon from '../utils/useTabbarIcon';
import EventsList from '../components/EventsList';
import {getEvent, ProjetXEvent, updateParticipation} from '../api/Events';
import auth from '@react-native-firebase/auth';

const HomeScreen: NavigationFunctionComponent = ({
  componentId,
  event,
}: {
  componentId: string;
  event?: ProjetXEvent;
}) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  useTabbarIcon(componentId, 'home');

  const goToEvent = (eventToGo: ProjetXEvent, pollId?: string) => {
    Navigation.push(componentId, {
      component: {
        name: 'Event',
        passProps: {
          event: eventToGo,
          pollId,
        },
      },
    });
  };

  const handleLocalizationChange = () => {
    setI18nConfig();
    forceUpdate();
  };

  const handleDynamicLink = async (
    link: FirebaseDynamicLinksTypes.DynamicLink | null,
  ) => {
    if (link && link.url) {
      const matches = /(http[s]?:\/\/)?([^/\s]+\/)(.[^?]*)(\?.*)?/.exec(
        link.url,
      );
      if (matches) {
        const path = matches[3];
        const routes = path.split('/');
        if (routes[0] === 'event') {
          const eventLoaded = await getEvent(routes[1]);
          await updateParticipation(eventLoaded.id, 'notanswered');
          if (routes[2] === 'poll') {
            goToEvent(eventLoaded, routes[3]);
          } else {
            goToEvent(eventLoaded);
          }
        }
      }
    }
  };

  useEffect(() => {
    RNLocalize.addEventListener('change', handleLocalizationChange);
    dynamicLinks().getInitialLink().then(handleDynamicLink);
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => {
      RNLocalize.removeEventListener('change', handleLocalizationChange);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (event) {
      goToEvent(event);
    }
  }, [event]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Title style={styles.title}>{translate('Mes événements')}</Title>
      <EventsList
        componentId={componentId}
        onOpenEvent={(eventClicked: ProjetXEvent) => {
          Navigation.push(componentId, {
            component: {
              name: 'Event',
              passProps: {
                event: eventClicked,
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
                passProps: {
                  event: {},
                },
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
    backgroundColor: 'white',
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
    title: {
      text: 'Home',
    },
  },
};

export default HomeScreen;
