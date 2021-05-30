import database from '@react-native-firebase/database';
import {getMe} from '../user/usersApi';
import slugify from 'slugify';
import {nanoid} from 'nanoid';
import {eventConverter, EventParticipation, ProjetXEvent} from './eventsTypes';
import {buildLink} from './eventsUtils';
import {fetchEvents, participationUpdated, updateEvent} from './eventsSlice';
import {store} from '../../app/store';

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
