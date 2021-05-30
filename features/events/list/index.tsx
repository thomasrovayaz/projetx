import React, {useEffect, useReducer} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {setI18nConfig, translate} from '../../../app/locales';
import Button from '../../../common/Button';
import Title from '../../../common/Title';
import useTabbarIcon from '../../../app/useTabbarIcon';
import EventsList from './EventsList';
import {EventParticipation, ProjetXEvent} from '../eventsTypes';
import {getEvent, updateParticipation} from '../eventsApi';
import {getUsers} from '../../user/usersApi';
import {useSelector} from 'react-redux';
import {createEvent, openEvent, selectCurrentEvent} from '../eventsSlice';
import {useAppDispatch} from '../../../app/redux';

const HomeScreen: NavigationFunctionComponent = ({
  componentId,
  event,
}: {
  componentId: string;
  event?: ProjetXEvent;
}) => {
  const currentEvent = useSelector(selectCurrentEvent);
  const dispatch = useAppDispatch();
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  useTabbarIcon(componentId, 'home');

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
          await updateParticipation(
            eventLoaded.id,
            EventParticipation.notanswered,
          );
          if (routes[2] === 'poll') {
            dispatch(openEvent(eventLoaded));
            //todo open poll routes[3]
          } else {
            dispatch(openEvent(eventLoaded));
          }
        }
      }
    }
  };

  useEffect(() => {
    RNLocalize.addEventListener('change', handleLocalizationChange);
    dynamicLinks().getInitialLink().then(handleDynamicLink);
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    getUsers();
    return () => {
      RNLocalize.removeEventListener('change', handleLocalizationChange);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (event) {
      dispatch(openEvent(event));
    }
  }, [event]);
  useEffect(() => {
    if (currentEvent) {
      if (currentEvent.isPhantom()) {
        Navigation.push(componentId, {
          component: {
            name: 'CreateEventType',
          },
        });
      } else {
        Navigation.push(componentId, {
          component: {
            name: 'Event',
          },
        });
      }
    }
  }, [currentEvent]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Title style={styles.title}>{translate('Mes événements')}</Title>
      <EventsList
        componentId={componentId}
        onOpenEvent={(eventClicked: ProjetXEvent) =>
          dispatch(openEvent(eventClicked))
        }
      />
      <View style={styles.buttonCreate}>
        <Button
          title="Créer un événement"
          onPress={() => dispatch(createEvent())}
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
