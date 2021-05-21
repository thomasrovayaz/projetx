import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import moment from 'moment';
import {LocationValue} from '../components/LocationPicker';
import {DateValue} from '../components/DateInput';
import {getMe} from './Users';
import slugify from 'slugify';
import {nanoid} from 'nanoid';

export class ProjetXEvent {
  public id: string;
  public author: string;
  public title: string;
  public description: string;
  public type: 'sport' | 'diner' | 'party' | 'weekend' | 'week' | 'travel';
  public date: DateValue;
  public time: moment.Moment;
  public location: LocationValue;
  public participations: {
    [uid: string]: 'going' | 'maybe' | 'notanswered' | 'notgoing';
  };

  constructor(
    id: string,
    author: string,
    title: string,
    description: string,
    type: 'sport' | 'diner' | 'party' | 'weekend' | 'week' | 'travel',
    date: DateValue,
    time: moment.Moment,
    location: LocationValue,
    participations: {
      [uid: string]: 'going' | 'maybe' | 'notanswered' | 'notgoing';
    },
  ) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.description = description;
    this.type = type;
    this.date = date;
    this.time = time;
    this.location = location;
    this.participations = participations;
  }
}
const eventConverter = {
  fromFirestore(snapshot: FirebaseDatabaseTypes.DataSnapshot): ProjetXEvent {
    const data = snapshot.val();
    return new ProjetXEvent(
      snapshot.key || '',
      data.author,
      data.title,
      data.description,
      data.type,
      data.date,
      data.time,
      data.location,
      data.participations,
    );
  },
};

export async function getMyEvents() {
  const me = getMe()?.uid;
  if (!me) {
    return [];
  }
  const eventsDb = await database()
    .ref('events')
    .orderByChild('participations/' + me)
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
  await database().ref(`events/${event.id}`).set(event);
  return eventConverter.fromFirestore(
    await database().ref(`events/${event.id}`).once('value'),
  );
}
