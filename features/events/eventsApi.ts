import database from '@react-native-firebase/database';
import {getMe, getMyId} from '../user/usersApi';
import slugify from 'slugify';
import {nanoid} from 'nanoid';
import {
  eventConverter,
  EventParticipation,
  EventType,
  ProjetXEvent,
} from './eventsTypes';
import {buildLink} from './eventsUtils';
import {
  eventCanceled,
  fetchEvents,
  participationUpdated,
  remindEvent,
  updateEvent,
} from './eventsSlice';
import {store} from '../../app/store';
import {translate} from '../../app/locales';
import OneSignal from 'react-native-onesignal';
import {ProjetXUser} from '../user/usersTypes';
import moment from 'moment';
import axios from 'axios';
import Config from 'react-native-config';
import {
  NotificationParentType,
  NotificationType,
  postNotification,
} from '../../app/onesignal';
import {showToast} from '../../common/Toast';

export const joinEvent = async (event: ProjetXEvent) => {
  await updateParticipation(event, EventParticipation.going);
  await showToast({message: translate('Que serait une soirée sans toi 😍')});
};
export const refuseEvent = async (event: ProjetXEvent) => {
  await updateParticipation(event, EventParticipation.notgoing);
  await showToast({message: translate('Dommage 😢')});
};

export const remindMeEvent = async (event: ProjetXEvent) => {
  await updateParticipation(event, EventParticipation.maybe);
  await addReminder(event, moment().add({day: 1}));
};
const addReminder = async (event: ProjetXEvent, date: moment.Moment) => {
  try {
    await addEventAnswerReminder(event, date);
    await showToast({message: translate('Rappel enregistré 👌')});
  } catch (e) {
    console.error(e);
    await showToast({
      message: translate("Erreur lors de l'ajout du rappel 😕"),
    });
  }
};

export async function getEvent(id: string): Promise<ProjetXEvent> {
  const eventDb = await database().ref(`events/${id}`).once('value');
  const event = eventConverter.fromFirestore(eventDb);
  store.dispatch(updateEvent(event));
  return event;
}
export async function getMyEvents() {
  const eventsDb = await database()
    .ref('events')
    .orderByChild('participations/' + getMyId())
    .startAt(0)
    .once('value');
  const events: ProjetXEvent[] = [];
  eventsDb.forEach(eventDb => {
    events.push(eventConverter.fromFirestore(eventDb));
    return undefined;
  });
  store.dispatch(fetchEvents(events));
  return events;
}
export const slugifyEventId = (title: string) => {
  return `${slugify(title || '', {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  })}-${nanoid(11)}`;
};

export async function saveEvent(event: ProjetXEvent): Promise<ProjetXEvent> {
  if (!event.id) {
    event.id = slugifyEventId(event.title || '');
  }
  if (!event.author) {
    event.author = getMyId();
  }
  if (!event.shareLink) {
    event.shareLink = await buildLink(event);
  }
  await database()
    .ref(`events/${event.id}`)
    .set(eventConverter.toFirestore(event));
  const updatedEvent = eventConverter.fromFirestore(
    await database().ref(`events/${event.id}`).once('value'),
  );
  store.dispatch(updateEvent(updatedEvent));
  return updatedEvent;
}
export async function cancelEvent(event: ProjetXEvent): Promise<void> {
  await database().ref(`events/${event.id}`).remove();
  store.dispatch(eventCanceled(event));
}

export async function updateParticipation(
  event: ProjetXEvent,
  type: EventParticipation,
) {
  if (!event.id) {
    return;
  }
  await database()
    .ref(`events/${event.id}/participations/${getMyId()}`)
    .set(type);
  store.dispatch(
    participationUpdated({eventId: event.id, userId: getMyId(), type}),
  );
  notifyParticipation(event, getMe().displayName, type);
}

export function notifyNewEvent(
  event: ProjetXEvent,
  usersToNotify: ProjetXUser[],
) {
  if (!usersToNotify || usersToNotify.length <= 0) {
    return;
  }
  let message = translate('Souhaites-tu y participer?');
  let dateMessage = event.getStartingDate()?.fromNow() || '';
  let title = '';
  switch (event.type) {
    case EventType.diner:
      title = translate('Tu es invité à un dîner');
      break;
    case EventType.party:
      title = translate('Tu es invité à une soirée');
      break;
    case EventType.travel:
      title = translate('Tu es invité à un voyage');
      break;
    case EventType.sport:
      title = translate('Tu es invité à une sortie de sport');
      break;
    case EventType.week:
      title = translate('Tu es invité à une semaine de vacance');
      break;
    case EventType.weekend:
      title = translate('Tu es invité à un weekend');
      break;
    case EventType.other:
      title = translate('Tu es invité à un événement');
      break;
  }

  const include_player_ids = usersToNotify
    .filter(
      ({oneSignalId, id, settings}) =>
        oneSignalId && id !== getMyId() && settings.eventNotification !== false,
    )
    .map(({oneSignalId}) => oneSignalId);

  postNotification(
    include_player_ids,
    NotificationType.EVENT_INVITATION,
    {
      id: event.id,
      type: NotificationParentType.EVENT,
    },
    `${title} ${dateMessage}`,
    `${event.title} ${translate('par')} ${getMe()?.displayName}\n${message}`,
    [
      {id: EventParticipation.going, text: translate('Accepter')},
      {id: EventParticipation.notgoing, text: translate('Refuser')},
    ],
  );
}

export function notifyParticipation(
  event: ProjetXEvent,
  pseudo: string | null,
  type: EventParticipation,
) {
  if (!event.author || !pseudo) {
    return;
  }
  const oneSignalIdAuthor =
    store.getState().users.list[event.author].oneSignalId;
  if (!oneSignalIdAuthor) {
    return;
  }
  let message;
  switch (type) {
    case EventParticipation.going:
      message = `${pseudo} ${translate('est chaud')}`;
      break;
    case EventParticipation.notgoing:
      message = `${pseudo} ${translate("n'est pas chaud")}`;
      break;
    default:
      return;
  }
  postNotification(
    [oneSignalIdAuthor],
    NotificationType.PARTICIPATION_UPDATE,
    {
      id: event.id,
      type: NotificationParentType.EVENT,
    },
    event.title,
    message,
  );
}

export async function addEventAnswerReminder(
  event: ProjetXEvent,
  date: moment.Moment,
) {
  const oneSignalId = store.getState().users.list[getMyId()].oneSignalId;
  if (!oneSignalId) {
    throw new Error(translate('Tu ne peux pas envoyer de notification'));
  }
  const notificationObj = {
    headings: {
      en: event.title,
    },
    contents: {
      en: translate('Rappel pour avoir ta réponse'),
    },
    data: {eventId: event.id, type: NotificationType.EVENT_REMINDER},
    buttons: [
      {id: EventParticipation.going, text: translate('Accepter')},
      {id: EventParticipation.notgoing, text: translate('Refuser')},
    ],
    send_after: date.format(),
    include_player_ids: [oneSignalId],
  };
  console.log(notificationObj);
  const jsonString = JSON.stringify(notificationObj);
  await new Promise((resolve, reject) => {
    OneSignal.postNotification(
      jsonString,
      (success: any) => {
        console.log('Success:', success);
        if (success.errors) {
          reject(success.errors);
        }
        store.dispatch(remindEvent({event, onesignalId: success.id, date}));
        resolve();
      },
      error => {
        console.log('Error:', error);
        reject(error);
      },
    );
  });
}
export async function removeEventAnswerReminder(onesignalId: string) {
  return axios.delete(
    `https://onesignal.com/api/v1/notifications/${onesignalId}?app_id=${Config.ONESIGNAL_API_KEY}`,
    {
      headers: {
        Authorization: `Basic ${Config.ONESIGNAL_REST_API_KEY}`,
      },
    },
  );
}