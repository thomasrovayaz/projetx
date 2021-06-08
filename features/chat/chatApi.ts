import database from '@react-native-firebase/database';
import {IMessage} from 'react-native-gifted-chat/lib/Models';
import {EventParticipation, ProjetXEvent} from '../events/eventsTypes';
import {store} from '../../app/store';
import OneSignal from 'react-native-onesignal';
import {getMe} from '../user/usersApi';
import {chatsUpdated} from './chatsSlice';
import {NotificationType} from '../../app/onesignal';

export async function connectChats() {
  return database()
    .ref('chats')
    .on('value', (snapshot: any) => {
      const dbChats = snapshot.val();
      const chats: {
        [uid: string]: IMessage[];
      } = {};
      for (const eventId in dbChats) {
        if (dbChats.hasOwnProperty(eventId)) {
          chats[eventId] = Object.values<IMessage>(dbChats[eventId]).sort(
            function (a, b) {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            },
          );
        }
      }
      store.dispatch(chatsUpdated(chats));
    });
}

export async function addMessage(message: IMessage, event: ProjetXEvent) {
  await database()
    .ref(`chats/${event.id}`)
    .push({...message, createdAt: new Date().getTime()});
  messageNotification(event, getMe().displayName, message.text);
}

function messageNotification(
  event: ProjetXEvent,
  pseudo: string | null,
  message: string,
) {
  if (
    !pseudo ||
    !event.participations ||
    Object.keys(event.participations).length <= 0
  ) {
    return;
  }
  const notificationObj = {
    headings: {
      en: `${pseudo} à ${event.title}`,
    },
    contents: {
      en: message,
    },
    data: {eventId: event.id, type: NotificationType.NEW_MESSAGE},
    include_player_ids: Object.keys(event.participations)
      .filter(
        userId =>
          userId !== getMe().uid &&
          event.participations[userId] === EventParticipation.going &&
          store.getState().users.list[userId].oneSignalId,
      )
      .map(userId => store.getState().users.list[userId].oneSignalId),
    android_group: event.id,
    thread_id: event.id,
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
