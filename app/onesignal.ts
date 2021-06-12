import OneSignal, {NotificationReceivedEvent} from 'react-native-onesignal';
import Config from 'react-native-config';
import {updateOneSignalId} from '../features/user/usersApi';
import auth from '@react-native-firebase/auth';
import {getEvent, updateParticipation} from '../features/events/eventsApi';
import {translate} from './locales';
import {EventParticipation, ProjetXEvent} from '../features/events/eventsTypes';
import {showToast} from '../common/Toast';
import {getGroup} from '../features/groups/groupsApi';
import {ProjetXGroup} from '../features/groups/groupsTypes';
import {openEvent} from '../features/events/eventsSlice';
import {Navigation} from 'react-native-navigation';
import {store} from './store';

export enum NotificationType {
  EVENT_INVITATION = 'EVENT_INVITATION',
  EVENT_REMINDER = 'EVENT_REMINDER',
  NEW_MESSAGE = 'NEW_MESSAGE',
  PARTICIPATION_UPDATE = 'PARTICIPATION_UPDATE',
  GROUP_INVITATION = 'GROUP_INVITATION',
}
export enum NotificationParentType {
  EVENT = 'EVENT',
  GROUP = 'GROUP',
}

export interface AdditionalData {
  eventId?: string;
  parentId: string;
  parentType: NotificationParentType;
  type: NotificationType;
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

const onOpenEvent = (
  componentId: string,
  eventToOpen: ProjetXEvent,
  chat?: boolean,
) => {
  store.dispatch(openEvent(eventToOpen));
  Navigation.push(componentId, {
    component: {
      name: 'Event',
      passProps: {
        chat,
      },
    },
  });
};
const onOpenGroup = (componentId: string, groupId: string, chat?: boolean) => {
  Navigation.push(componentId, {
    component: {
      name: 'DetailsGroupScreen',
      passProps: {
        groupId,
        chat,
      },
    },
  });
};

export const notificationWillShowInForegroundHandler =
  (componentId: string) =>
  async (notificationReceivedEvent: NotificationReceivedEvent) => {
    console.log(
      'OneSignal: notification will show in foreground:',
      notificationReceivedEvent,
    );
    let notification = notificationReceivedEvent.getNotification();
    console.log('notification: ', notification);
    const data = notification.additionalData as AdditionalData;
    const type = data.type as NotificationType;
    const parentId = data.parentId || data.eventId;
    let parentLoaded: ProjetXEvent | ProjetXGroup | undefined;
    if (parentId) {
      switch (data.parentType) {
        case NotificationParentType.EVENT:
          parentLoaded = await getEvent(parentId);
          break;
        case NotificationParentType.GROUP:
          parentLoaded = await getGroup(parentId);
          break;
      }
    }
    console.log('additionalData: ', data);
    if (type) {
      let buttons;
      if (
        type === NotificationType.EVENT_INVITATION &&
        parentLoaded instanceof ProjetXEvent
      ) {
        notificationReceivedEvent.complete();
        buttons = [
          {
            text: translate('Accepter'),
            onPress: async () => {
              await updateParticipation(
                parentLoaded as ProjetXEvent,
                EventParticipation.going,
              );
              await showToast({message: translate('Réponse envoyé 👍')});
              onOpenEvent(componentId, parentLoaded as ProjetXEvent);
            },
          },
          {
            text: translate('Refuser'),
            onPress: async () => {
              await updateParticipation(
                parentLoaded as ProjetXEvent,
                EventParticipation.notgoing,
              );
              await showToast({message: translate('Réponse envoyé 👍')});
              onOpenEvent(componentId, parentLoaded as ProjetXEvent);
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
          if (parentLoaded instanceof ProjetXEvent) {
            onOpenEvent(
              componentId,
              parentLoaded,
              type === NotificationType.NEW_MESSAGE,
            );
          } else if (parentLoaded instanceof ProjetXGroup && parentId) {
            onOpenGroup(
              componentId,
              parentId,
              type === NotificationType.NEW_MESSAGE,
            );
          }
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

export function postNotification(
  onesignalIds: string[],
  type: NotificationType,
  parent: {id: string; type: NotificationParentType},
  title: string | undefined,
  message: string,
  buttons?: any[],
) {
  if (onesignalIds.length === 0) {
    return;
  }
  const datas: AdditionalData = {
    eventId:
      parent.type === NotificationParentType.EVENT ? parent.id : undefined,
    parentId: parent.id,
    parentType: parent.type,
    type,
  };
  const notificationObj = {
    headings: {
      en: title,
    },
    contents: {
      en: message,
    },
    data: datas,
    buttons,
    include_player_ids: onesignalIds,
    android_group: parent.id,
    thread_id: parent.id,
  };
  console.log(notificationObj);
  const jsonString = JSON.stringify(notificationObj);
  OneSignal.postNotification(
    jsonString,
    success => {
      console.log('Success:', success);
    },
    error => {
      console.log('Error:', error);
    },
  );
}
