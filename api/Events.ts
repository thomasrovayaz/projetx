import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import moment from 'moment';
import {LocationValue} from '../components/LocationPicker';
import {DateValue} from '../components/DateInput';
import {getMe} from './Users';
import slugify from 'slugify';
import {nanoid} from 'nanoid';
import dynamicLinks, {firebase} from '@react-native-firebase/dynamic-links';

export class ProjetXEvent {
  public id: string;
  public author: string;
  public title: string;
  public description: string | undefined;
  public type: 'sport' | 'diner' | 'party' | 'weekend' | 'week' | 'travel';
  public date: DateValue | undefined;
  public time: moment.Moment | undefined;
  public location: LocationValue | undefined;
  public participations: {
    [uid: string]: 'going' | 'maybe' | 'notanswered' | 'notgoing';
  };

  constructor(
    id: string,
    author: string,
    title: string,
    description: string | undefined,
    type: 'sport' | 'diner' | 'party' | 'weekend' | 'week' | 'travel',
    date: DateValue | undefined,
    time: moment.Moment | undefined,
    location: LocationValue | undefined,
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
const timeConverter = {
  fromFirestore(time?: string): moment.Moment | undefined {
    if (!time) {
      return undefined;
    }
    return moment(time);
  },
  toFirestore(time?: moment.Moment) {
    if (!time) {
      return undefined;
    }
    return time.format();
  },
};
const dateConverter = {
  fromFirestore(date?: {
    date: string;
    startDate: string;
    endDate: string;
  }): DateValue | undefined {
    if (!date) {
      return undefined;
    }
    return {
      date: date.date ? moment(date.date) : undefined,
      startDate: date.startDate ? moment(date.startDate) : undefined,
      endDate: date.endDate ? moment(date.endDate) : undefined,
    };
  },
  toFirestore(date?: DateValue) {
    if (!date) {
      return undefined;
    }
    return {
      date: date.date ? date.date.format() : undefined,
      startDate: date.startDate ? date.startDate.format() : undefined,
      endDate: date.endDate ? date.endDate.format() : undefined,
    };
  },
};
const eventConverter = {
  fromFirestore(snapshot: FirebaseDatabaseTypes.DataSnapshot): ProjetXEvent {
    const data = snapshot.val();
    return new ProjetXEvent(
      snapshot.key || '',
      data.author,
      data.title,
      data.description,
      data.type,
      dateConverter.fromFirestore(data.date),
      timeConverter.fromFirestore(data.time),
      data.location,
      data.participations,
    );
  },
};

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
  await database()
    .ref(`events/${event.id}`)
    .set({
      ...event,
      date: dateConverter.toFirestore(event.date),
      time: timeConverter.toFirestore(event.time),
    });
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

export async function buildLink(event: ProjetXEvent) {
  return await dynamicLinks().buildShortLink(
    {
      link: `https://projetx.page.link/event/${event.id}`,
      domainUriPrefix: 'https://projetx.page.link',
      ios: {
        bundleId: 'com.ProjetX',
        appStoreId: '1569675082',
      },
      android: {
        packageName: 'com.projetx',
      },
      social: {title: event.title, descriptionText: event.description},
    },
    firebase.dynamicLinks.ShortLinkType.SHORT,
  );
}
