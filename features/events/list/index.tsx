import React, {useEffect, useReducer} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {setI18nConfig, translate} from '../../../app/locales';
import Button from '../../../common/Button';
import Title from '../../../common/Title';
import useTabbarIcon from '../../../app/useTabbarIcon';
import EventsList from './EventsList';
import {EventParticipation, ProjetXEvent} from '../eventsTypes';
import {getEvent, updateParticipation} from '../eventsApi';
import {getMe, getUsers} from '../../user/usersApi';
import {createEvent, openEvent} from '../eventsSlice';
import {useAppDispatch} from '../../../app/redux';
import OneSignal from 'react-native-onesignal';
import Toast from 'react-native-simple-toast';

const HomeScreen: NavigationFunctionComponent = ({
  componentId,
  event,
}: {
  componentId: string;
  event?: ProjetXEvent;
}) => {
  const dispatch = useAppDispatch();
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  useTabbarIcon(componentId, 'home');

  const handleLocalizationChange = () => {
    setI18nConfig();
    forceUpdate();
  };

  const handleOpenEvent = async (
    eventId: string,
    participation?: EventParticipation,
  ) => {
    const eventLoaded = await getEvent(eventId);
    const me = getMe();
    if (me) {
      if (participation !== undefined) {
        await updateParticipation(eventLoaded, participation);
        Toast.showWithGravity('Réponse envoyé 👍', Toast.SHORT, Toast.TOP);
      } else if (!eventLoaded.participations[me.uid]) {
        await updateParticipation(eventLoaded, EventParticipation.notanswered);
      }
    }
    dispatch(openEvent({event: eventLoaded, componentId}));
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
          await handleOpenEvent(routes[1]);
          if (routes[2] === 'poll') {
            //todo open poll routes[3]
          }
        }
      }
    }
  };

  useEffect(() => {
    RNLocalize.addEventListener('change', handleLocalizationChange);
    dynamicLinks().getInitialLink().then(handleDynamicLink);
    OneSignal.setNotificationOpenedHandler(async ({notification, action}) => {
      console.log('OneSignal: notification opened:', notification, action);
      await handleOpenEvent(
        // @ts-ignore
        notification.additionalData.eventId,
        // @ts-ignore
        Number.parseInt(action.actionId, 10),
      );
    });
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    getUsers();
    return () => {
      RNLocalize.removeEventListener('change', handleLocalizationChange);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (event) {
      dispatch(openEvent({event, componentId}));
    }
  }, [event]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Title style={styles.title}>{translate('Mes événements')}</Title>
      <EventsList
        componentId={componentId}
        onOpenEvent={(eventClicked: ProjetXEvent) =>
          dispatch(openEvent({event: eventClicked, componentId}))
        }
      />
      <View style={styles.buttonCreate}>
        <Button
          title="Créer un événement"
          onPress={() => dispatch(createEvent(componentId))}
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
    marginHorizontal: 20,
    marginVertical: 10,
  },
  buttonCreate: {
    paddingVertical: 10,
    paddingHorizontal: 20,
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
