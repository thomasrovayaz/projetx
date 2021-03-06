import OneSignal, {NotificationReceivedEvent} from 'react-native-onesignal';
import Config from 'react-native-config';
import {getMyId, updateOneSignalId} from '../features/user/usersApi';
import auth from '@react-native-firebase/auth';
import {getEvent, updateParticipation} from '../features/events/eventsApi';
import {translate} from './locales';
import {EventParticipation, ProjetXEvent} from '../features/events/eventsTypes';
import {showToast} from '../common/Toast';
import {addMember, getGroup} from '../features/groups/groupsApi';
import {ProjetXGroup} from '../features/groups/groupsTypes';
import {ParamListBase} from '@react-navigation/routers';
import {NavigationProp} from '@react-navigation/core/lib/typescript/src/types';
import {Platform} from 'react-native';

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

export const setupOneSignal = async (): Promise<void> => {
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
  console.log(deviceState);
  if (Platform.OS === 'ios' && !deviceState.isSubscribed) {
    OneSignal.promptForPushNotificationsWithUserResponse(console.log);
  }
};

const onOpenEvent = (
  navigation: NavigationProp<ParamListBase>,
  eventId: string,
  chat?: boolean,
) => {
  navigation.navigate('Event', {eventId, chat});
};
const onOpenGroup = (
  navigation: NavigationProp<ParamListBase>,
  groupId: string,
  chat?: boolean,
) => {
  navigation.navigate('DetailsGroupScreen', {groupId, chat});
};

export const handleOpenNotification = async (
  navigation: NavigationProp<ParamListBase>,
  data: AdditionalData,
  participation?: EventParticipation,
): Promise<void> => {
  const {eventId, type, parentType} = data;
  const parentId = data.parentId || eventId;
  let parentLoaded: ProjetXEvent | ProjetXGroup | undefined;
  if (parentId) {
    switch (parentType) {
      case NotificationParentType.EVENT:
        parentLoaded = await getEvent(parentId);
        break;
      case NotificationParentType.GROUP:
        parentLoaded = await getGroup(parentId);
        break;
    }
  }
  if (
    type === NotificationType.EVENT_INVITATION &&
    parentLoaded instanceof ProjetXEvent
  ) {
    if (participation !== undefined) {
      await updateParticipation(parentLoaded, participation);
      await showToast({message: translate('R??ponse envoy?? ????')});
    } else if (
      !parentLoaded.participations[getMyId()] &&
      parentLoaded.participations[getMyId()] !== EventParticipation.going
    ) {
      await updateParticipation(parentLoaded, EventParticipation.notanswered);
    }
  }
  if (
    type === NotificationType.GROUP_INVITATION &&
    parentLoaded instanceof ProjetXGroup
  ) {
    await addMember(parentLoaded);
  }
  if (parentLoaded instanceof ProjetXEvent && parentId) {
    onOpenEvent(navigation, parentId, type === NotificationType.NEW_MESSAGE);
  } else if (parentLoaded instanceof ProjetXGroup && parentId) {
    onOpenGroup(navigation, parentId, type === NotificationType.NEW_MESSAGE);
  }
};

export const notificationWillShowInForegroundHandler =
  (navigation: NavigationProp<ParamListBase>) =>
  async (
    notificationReceivedEvent: NotificationReceivedEvent,
  ): Promise<void> => {
    console.log(
      'OneSignal: notification will show in foreground:',
      notificationReceivedEvent,
    );
    const notification = notificationReceivedEvent.getNotification();
    console.log('notification: ', notification);
    const data = notification.additionalData as AdditionalData;
    const type = data.type as NotificationType;
    const parentId = data.parentId || data.eventId;
    console.log('additionalData: ', data);
    if (type) {
      let buttons;
      if (type === NotificationType.EVENT_INVITATION) {
        notificationReceivedEvent.complete();
        buttons = [
          {
            text: translate('Accepter'),
            onPress: async () => {
              if (parentId) {
                await updateParticipation(
                  await getEvent(parentId),
                  EventParticipation.going,
                );
                await showToast({message: translate('R??ponse envoy?? ????')});
                onOpenEvent(navigation, parentId);
              }
            },
          },
          {
            text: translate('Refuser'),
            onPress: async () => {
              if (parentId) {
                await updateParticipation(
                  await getEvent(parentId),
                  EventParticipation.notgoing,
                );
                await showToast({message: translate('R??ponse envoy?? ????')});
                onOpenEvent(navigation, parentId);
              }
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
          handleOpenNotification(navigation, data);
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
): void {
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
