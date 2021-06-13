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
import {ProjetXEvent} from '../eventsTypes';
import {getUsers} from '../../user/usersApi';
import {createEvent, openEvent, selectMyEvents} from '../eventsSlice';
import {useAppDispatch, useAppSelector} from '../../../app/redux';
import OneSignal from 'react-native-onesignal';
import {connectChats} from '../../chat/chatApi';
import {
  AdditionalData,
  handleOpenNotification,
  NotificationParentType,
  NotificationType,
  notificationWillShowInForegroundHandler,
} from '../../../app/onesignal';
import {getMyGroups} from '../../groups/groupsApi';
import CreateEventTonight from '../create/components/CreateEventTonight';
import {selectTotalEventUnreadMessageCount} from '../../chat/chatsSlice';

const HomeScreen: NavigationFunctionComponent = ({
  componentId,
  event,
}: {
  componentId: string;
  event?: ProjetXEvent;
}) => {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectMyEvents);
  const totalUnread = useAppSelector(selectTotalEventUnreadMessageCount);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  useTabbarIcon(
    componentId,
    'home',
    totalUnread ? totalUnread + '' : undefined,
  );

  const handleLocalizationChange = () => {
    setI18nConfig();
    forceUpdate();
  };

  const onOpenEvent = (eventToOpen: ProjetXEvent, chat?: boolean) => {
    dispatch(openEvent(eventToOpen));
    Navigation.push(componentId, {
      component: {
        name: 'Event',
        passProps: {
          chat,
        },
      },
    });
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
          await handleOpenNotification(componentId, {
            type: NotificationType.EVENT_INVITATION,
            eventId: routes[1],
            parentId: routes[1],
            parentType: NotificationParentType.EVENT,
          });
          if (routes[2] === 'poll') {
            //todo open poll routes[3]
          }
        } else if (routes[0] === 'group') {
          await handleOpenNotification(componentId, {
            type: NotificationType.GROUP_INVITATION,
            eventId: routes[1],
            parentId: routes[1],
            parentType: NotificationParentType.GROUP,
          });
        }
      }
    }
  };

  useEffect(() => {
    RNLocalize.addEventListener('change', handleLocalizationChange);
    dynamicLinks().getInitialLink().then(handleDynamicLink);

    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationWillShowInForegroundHandler(componentId),
    );
    OneSignal.setNotificationOpenedHandler(async ({notification, action}) => {
      console.log('OneSignal: notification opened:', notification, action);
      await handleOpenNotification(
        componentId,
        notification.additionalData as AdditionalData,
        // @ts-ignore
        action.actionId,
      );
    });
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    getUsers();
    getMyGroups();
    connectChats();
    return () => {
      RNLocalize.removeEventListener('change', handleLocalizationChange);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (event) {
      onOpenEvent(event);
    }
  }, [event]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Title style={styles.title}>{translate('Mes événements')}</Title>
      <EventsList
        componentId={componentId}
        events={events}
        onOpenEvent={onOpenEvent}
      />
      <View style={styles.buttonCreate}>
        <Button
          style={[styles.ctaLeft]}
          title={translate('Créer un événement')}
          onPress={() => dispatch(createEvent(componentId))}
        />
        <CreateEventTonight
          style={[styles.ctaRight]}
          componentId={componentId}
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
    flexDirection: 'row',
  },
  ctaLeft: {
    flex: 1,
    marginRight: 5,
  },
  ctaRight: {
    flex: 1,
    marginLeft: 5,
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
