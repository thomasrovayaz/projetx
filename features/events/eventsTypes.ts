import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import moment from 'moment';
import {LocationValue} from './create/components/LocationPicker';

export interface DateValue {
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  date?: moment.Moment;
}

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
  public shareLink: string;

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
    shareLink: string,
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
    this.shareLink = shareLink;
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
export const eventConverter = {
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
      data.shareLink,
    );
  },
  toFirestore(event?: ProjetXEvent) {
    if (!event) {
      return undefined;
    }
    return {
      ...event,
      date: dateConverter.toFirestore(event.date),
      time: timeConverter.toFirestore(event.time),
    };
  },
};
