import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import moment from 'moment';

export class Event {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly description: string,
    readonly type: 'sport' | 'diner' | 'party' | 'weekend' | 'week' | 'travel',
    readonly date: moment.Moment,
    readonly time: moment.Moment,
  ) {}
}
const eventConverter = {
  fromFirestore(snapshot: FirebaseDatabaseTypes.DataSnapshot): Event {
    const data = snapshot.val();
    return new Event(
      data.id,
      data.title,
      data.description,
      data.type,
      moment(data.date),
      moment(data.time),
    );
  },
};

export async function getEvents() {
  const eventsDb = await database().ref('events').orderByValue().once('value');
  const events: Event[] = [];
  eventsDb.forEach(eventDb => {
    events.push(eventConverter.fromFirestore(eventDb));
    return true;
  });
  return events;
}
