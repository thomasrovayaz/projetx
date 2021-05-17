import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import moment from 'moment';
import {LocationValue} from '../components/LocationPicker';

export class ProjetXEvent {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly description: string,
    readonly type: 'sport' | 'diner' | 'party' | 'weekend' | 'week' | 'travel',
    readonly date: moment.Moment,
    readonly time: moment.Moment,
    readonly location: LocationValue,
  ) {}
}
const eventConverter = {
  fromFirestore(snapshot: FirebaseDatabaseTypes.DataSnapshot): ProjetXEvent {
    const data = snapshot.val();
    return new ProjetXEvent(
      data.id,
      data.title,
      data.description,
      data.type,
      moment(data.date),
      moment(data.time),
      data.location,
    );
  },
};

export async function getEvents() {
  const eventsDb = await database().ref('events').orderByValue().once('value');
  const events: ProjetXEvent[] = [];
  eventsDb.forEach(eventDb => {
    events.push(eventConverter.fromFirestore(eventDb));
    return true;
  });
  return events;
}
