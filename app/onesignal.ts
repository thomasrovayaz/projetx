import OneSignal, {NotificationReceivedEvent} from 'react-native-onesignal';
import Config from 'react-native-config';
import {updateOneSignalId} from '../features/user/usersApi';
import auth from '@react-native-firebase/auth';
import {getEvent, updateParticipation} from '../features/events/eventsApi';
import {translate} from './locales';
import {EventParticipation, ProjetXEvent} from '../features/events/eventsTypes';
import {showToast} from '../common/Toast';

export enum NotificationType {
  EVENT_INVITATION = 'EVENT_INVITATION',
  EVENT_REMINDER = 'EVENT_REMINDER',
  NEW_MESSAGE = 'NEW_MESSAGE',
  PARTICIPATION_UPDATE = 'PARTICIPATION_UPDATE',
}

export interface AdditionalData {
  eventId: string;
  chat?: boolean;
  type?: NotificationType;
}

export const setupOneSignal = async () => {
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId(Config.ONESIGNAL_API_KEY);
  OneSignal.addSubscriptionObserver(async ({from, to}) => {
    const currentUser = auth().currentUser;
    if (!from.isSubscribed && to.isSubscribed && to.userId && currentUser) {
      await updateOneSignalId(to.userId, currentUser.uid);
    }
  });
  const deviceState = await OneSignal.getDeviceState();
  const currentUser = auth().currentUser;
  console.log('deviceState', deviceState, currentUser);
  if (currentUser) {
    OneSignal.setExternalUserId(currentUser.uid);
    await updateOneSignalId(deviceState.userId, currentUser.uid);
    OneSignal.sendTag('userId', currentUser.uid);
  } else {
    auth().onAuthStateChanged(async user => {
      console.log('onAuthStateChanged', user, deviceState.userId);
      if (user) {
        OneSignal.setExternalUserId(user.uid);
        await updateOneSignalId(deviceState.userId, user.uid);
        OneSignal.sendTag('userId', user.uid);
      }
    });
  }
};

export const notificationWillShowInForegroundHandler =
  (onOpenEvent: {(eventToOpen: ProjetXEvent, chat?: boolean): void}) =>
  async (notificationReceivedEvent: NotificationReceivedEvent) => {
    console.log(
      'OneSignal: notification will show in foreground:',
      notificationReceivedEvent,
    );
    let notification = notificationReceivedEvent.getNotification();
    console.log('notification: ', notification);
    const data = notification.additionalData as AdditionalData;
    const type = data.type as NotificationType;
    const eventId = data.eventId;
    console.log('additionalData: ', data);
    if (type) {
      const eventLoaded = await getEvent(eventId);
      let buttons;
      if (type === NotificationType.EVENT_INVITATION && eventLoaded) {
        notificationReceivedEvent.complete();
        buttons = [
          {
            text: translate('Accepter'),
            onPress: async () => {
              await updateParticipation(eventLoaded, EventParticipation.going);
              await showToast({message: translate('Réponse envoyé 👍')});
              onOpenEvent(eventLoaded);
            },
          },
          {
            text: translate('Refuser'),
            onPress: async () => {
              await updateParticipation(
                eventLoaded,
                EventParticipation.notgoing,
              );
              await showToast({message: translate('Réponse envoyé 👍')});
              onOpenEvent(eventLoaded);
            },
          },
        ];
      }
      await showToast({
        message: notification.body,
        title: notification.title,
        timeout: type === NotificationType.EVENT_INVITATION ? 0 : 5000,
        buttons,
        onOpen: () => {
          notificationReceivedEvent.complete();
          eventLoaded &&
            onOpenEvent(eventLoaded, type === NotificationType.NEW_MESSAGE);
        },
        onClose: hasClick => {
          if (!hasClick) {
            notificationReceivedEvent.complete(notification);
          } else {
            notificationReceivedEvent.complete();
          }
        },
      });
    } else {
      notificationReceivedEvent.complete(notification);
    }
  };
