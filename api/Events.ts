import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import moment from 'moment';
import {LocationValue} from '../components/LocationPicker';
import {DateValue} from '../components/DateInput';
import {getMe} from './Users';

export class ProjetXEvent {
  public participations: {
    [uid: string]: 'going' | 'maybe' | 'notanswered' | 'notgoing';
  };
  constructor(
    readonly id: string,
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
    this.participations = participations;
  }
}
const eventConverter = {
  fromFirestore(snapshot: FirebaseDatabaseTypes.DataSnapshot): ProjetXEvent {
    const data = snapshot.val();
    return new ProjetXEvent(
      snapshot.key || '',
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
