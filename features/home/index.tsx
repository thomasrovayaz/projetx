import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {
  Image,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import {setI18nConfig, translate} from '../../app/locales';
import {getMe, getUsers} from '../user/usersApi';
import OneSignal from 'react-native-onesignal';
import {connectChats} from '../chat/chatApi';
import {
  AdditionalData,
  handleOpenNotification,
  NotificationParentType,
  NotificationType,
  notificationWillShowInForegroundHandler,
} from '../../app/onesignal';
import {getMyGroups} from '../groups/groupsApi';
import {getMyEvents} from '../events/eventsApi';
import UpcomingEvents from '../events/list/UpcomingEvents';
import Title from '../../common/Title';
import LatestMessages from '../chat/LatestMessages';
import WaitingForAnswerEvents from '../events/list/WaitingForAnswerEvents';
import {useNavigation} from '@react-navigation/native';
import Text from '../../common/Text';
import Button from '../../common/Button';
import {createEvent, selectMyEvents} from '../events/eventsSlice';
import {useAppDispatch, useAppSelector} from '../../app/redux';

const HomeScreen: React.FC = () => {
  const events = useAppSelector(selectMyEvents);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

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
          await handleOpenNotification(navigation, {
            type: NotificationType.EVENT_INVITATION,
            eventId: routes[1],
            parentId: routes[1],
            parentType: NotificationParentType.EVENT,
          });
          if (routes[2] === 'poll') {
            //todo open poll routes[3]
          }
        } else if (routes[0] === 'group') {
          await handleOpenNotification(navigation, {
            type: NotificationType.GROUP_INVITATION,
            parentId: routes[1],
            parentType: NotificationParentType.GROUP,
          });
        }
      }
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await Promise.all([getMyEvents(), getUsers(), getMyGroups()]);
    setRefreshing(false);
  };
  const onRefresh = useCallback(() => {
    refresh();
  }, []);

  useEffect(() => {
    RNLocalize.addEventListener('change', handleLocalizationChange);
    dynamicLinks().getInitialLink().then(handleDynamicLink);

    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationWillShowInForegroundHandler(navigation),
    );
    OneSignal.setNotificationOpenedHandler(async ({notification, action}) => {
      console.log('OneSignal: notification opened:', notification, action);
      await handleOpenNotification(
        navigation,
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
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <LatestMessages
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Title style={styles.title}>{`${translate('Hello')} ${
              getMe().displayName
            } 👋`}</Title>
            <WaitingForAnswerEvents />
            <UpcomingEvents />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.content}
        ListEmptyComponent={() => {
          if (events && events.length > 0) {
            return null;
          }
          return (
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>
                {translate(
                  "Tu n'as pas encore d'événement, mais bonne nouvelle tu peux en créer un et inviter tes potes ! 🍾",
                )}
              </Text>
              <Image
                style={styles.emptyImage}
                source={require('../../assets/party.webp')}
              />
              <Button
                style={styles.emptyButton}
                icon={'calendar'}
                title={translate('Créer un évènement')}
                variant={'outlined'}
                onPress={() => {
                  dispatch(createEvent());
                  navigation.navigate('CreateEventType');
                }}
              />
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    paddingBottom: 100,
  },
  title: {
    paddingHorizontal: 20,
    textAlign: 'left',
    marginBottom: 20,
  },
  header: {
    marginTop: 40,
  },
  label: {
    paddingHorizontal: 20,
  },
  emptyList: {
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
  },
  emptyImage: {
    width: '100%',
    marginVertical: 40,
  },
  emptyButton: {},
});

export default HomeScreen;