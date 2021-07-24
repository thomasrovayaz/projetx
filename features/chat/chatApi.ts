import database from '@react-native-firebase/database';
import {store} from '../../app/store';
import {getMe, getMyId} from '../user/usersApi';
import {chatsUpdated} from './chatsSlice';
import {
  NotificationParentType,
  NotificationType,
  postNotification,
} from '../../app/onesignal';
import {ProjetXMessage} from './chatsTypes';
import {translate} from '../../app/locales';
import {ProjetXUser} from '../user/usersTypes';

export async function connectChats() {
  return database()
    .ref('chats')
    .on('value', (snapshot: any) => {
      const dbChats = snapshot.val();
      const chats: {
        [uid: string]: ProjetXMessage[];
      } = {};
      for (const parentId in dbChats) {
        if (dbChats.hasOwnProperty(parentId)) {
          chats[parentId] = Object.values<ProjetXMessage>(
            dbChats[parentId],
          ).sort(function (a, b) {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        }
      }
      store.dispatch(chatsUpdated(chats));
    });
}

export async function addMessage(
  message: ProjetXMessage,
  parent: {id: string; title: string; type: NotificationParentType},
  members: ProjetXUser[],
) {
  await database()
    .ref(`chats/${parent.id}`)
    .push({...message, createdAt: new Date().getTime()});
  let content = message.text;
  if (message.pollId) {
    content = translate('A proposé un sondage');
  } else if (message.image) {
    if (message.mime === 'image/gif') {
      content = translate('A envoyé un GIF');
    } else {
      content = translate('A envoyé une image');
    }
  }
  messageNotification(
    members
      .filter(
        user =>
          user.oneSignalId &&
          user.id !== getMyId() &&
          user.settings.messageNotification !== false,
      )
      .map(user => user.oneSignalId),
    parent,
    getMe().displayName,
    content,
  );
}

function messageNotification(
  members: string[],
  parent: {id: string; title: string; type: NotificationParentType},
  pseudo: string | null,
  message: string,
) {
  if (!pseudo || !members || members.length <= 0) {
    return;
  }
  const include_player_ids = members
    .filter(
      userId =>
        userId !== getMyId() && store.getState().users.list[userId].oneSignalId,
    )
    .map(userId => store.getState().users.list[userId].oneSignalId);

  postNotification(
    include_player_ids,
    NotificationType.NEW_MESSAGE,
    {
      id: parent.id,
      type: parent.type,
    },
    `${pseudo} à ${parent.title}`,
    message,
  );
}