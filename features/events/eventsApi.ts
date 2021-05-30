import database from '@react-native-firebase/database';
import {getMe} from '../user/usersApi';
import slugify from 'slugify';
import {nanoid} from 'nanoid';
import {eventConverter, ProjetXEvent} from './eventsTypes';
import {buildLink} from './eventsUtils';

export async function getEvent(id: string): Promise<ProjetXEvent> {
  const eventDb = await database().ref(`events/${id}`).once('value');
  return eventConverter.fromFirestore(eventDb);
}
export async function getMyEvents() {
  const me = getMe()?.uid;
  if (!me) {
    return [];
  }
  const eventsDb = await database()
    .ref('events')
    .orderByChild('participations/' + me)
    .startAt('')
    .once('value');
  const events: ProjetXEvent[] = [];
  eventsDb.forEach(eventDb => {
    events.push(eventConverter.fromFirestore(eventDb));
    return undefined;
  });
  return events;
}
export async function saveEvent(
  event: ProjetXEvent,
): Promise<ProjetXEvent | undefined> {
  const me = getMe()?.uid;
  if (!event || !me) {
    return undefined;
  }
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
  return eventConverter.fromFirestore(
    await database().ref(`events/${event.id}`).once('value'),
  );
}

export async function updateParticipation(
  eventId: string,
  type: 'going' | 'maybe' | 'notgoing' | 'notanswered',
) {
  const me = getMe();
  if (!me || !eventId) {
    return;
  }
  await database().ref(`events/${eventId}/participations/${me.uid}`).set(type);
}
