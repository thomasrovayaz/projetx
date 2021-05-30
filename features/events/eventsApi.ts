import database from '@react-native-firebase/database';
import {getMe} from '../user/usersApi';
import slugify from 'slugify';
import {nanoid} from 'nanoid';
import {
  eventConverter,
  EventParticipation,
  EventType,
  ProjetXEvent,
} from './eventsTypes';
import {buildLink} from './eventsUtils';
import {fetchEvents, participationUpdated, updateEvent} from './eventsSlice';
import {store} from '../../app/store';
import {translate} from '../../app/locales';
import OneSignal from 'react-native-onesignal';
import {ProjetXUser} from '../user/usersTypes';

export async function getEvent(id: string): Promise<ProjetXEvent> {
  const eventDb = await database().ref(`events/${id}`).once('value');
  const event = eventConverter.fromFirestore(eventDb);
  store.dispatch(updateEvent(event));
  return event;
}
export async function getMyEvents() {
  const me = getMe()?.uid;
  if (!me) {
    return [];
  }
  const eventsDb = await database()
    .ref('events')
    .orderByChild('participations/' + me)
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
export async function saveEvent(event: ProjetXEvent): Promise<ProjetXEvent> {
  const me = getMe()?.uid;
  if (!event.id) {
    event.id = `${slugify(event.title || '', {
      lower: true,
    })}-${nanoid(11)}`;
    event.author = me;
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

export async function updateParticipation(
  eventId: string,
  type: EventParticipation,
) {
  const me = getMe();
  if (!me || !eventId) {
    return;
  }
  await database().ref(`events/${eventId}/participations/${me.uid}`).set(type);
  store.dispatch(participationUpdated({eventId, userId: me.uid, type}));
}

export function pushNotifications(event: ProjetXEvent, friends: ProjetXUser[]) {
  let message = translate('Souhaites-tu y participer?');
  let dateMessage;
  if (event.date) {
    if (event.date.date) {
      const date = event.time
        ? event.date.date
            ?.hours(event.time.hour())
            ?.minutes(event.time.minute())
        : event.date.date;
      dateMessage = date.fromNow();
    } else if (event.date.startDate) {
      dateMessage = event.date.startDate.fromNow();
    }
  }
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
  }

  const notificationObj = {
    headings: {
      en: `${title} ${dateMessage}`,
    },
    contents: {
      en: `${event.title} ${translate('par')} ${
        getMe()?.displayName
      }\n${message}`,
    },
    data: {eventId: event.id},
    buttons: [
      {id: EventParticipation.going, text: translate('Accepter')},
      {id: EventParticipation.maybe, text: translate('Peut-être')},
      {id: EventParticipation.notgoing, text: translate('Refuser')},
    ],
    include_player_ids: friends
      .filter(({id, oneSignalId}) => event.participations[id] && oneSignalId)
      .map(({oneSignalId}) => oneSignalId),
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
