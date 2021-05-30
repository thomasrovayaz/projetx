import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import moment from 'moment';
import {LocationValue} from './create/components/LocationPicker';

export interface DateValue {
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  date?: moment.Moment;
}

export enum EventType {
  sport,
  diner,
  party,
  weekend,
  week,
  travel,
}
export enum EventParticipation {
  going,
  maybe,
  notanswered,
  notgoing,
}

export class ProjetXEvent {
  public id: string;
  public author: string | undefined;
  public title: string | undefined;
  public description: string | undefined;
  public type: EventType | undefined;
  public date: DateValue | undefined;
  public time: moment.Moment | undefined;
  public location: LocationValue | undefined;
  public participations: {
    [uid: string]: EventParticipation;
  } = {};
  public shareLink: string = '';

  constructor(
    id: string,
    author?: string,
    title?: string,
    description?: string | undefined,
    type?: EventType,
    date?: DateValue | undefined,
    time?: moment.Moment | undefined,
    location?: LocationValue | undefined,
    participations?: {
      [uid: string]: EventParticipation;
    },
    shareLink?: string,
  ) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.description = description;
    this.type = type;
    this.date = date;
    this.time = time;
    this.location = location;
    this.participations = participations || {};
    this.shareLink = shareLink || '';
  }
  isPhantom() {
    return !this.id || this.id === '';
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
