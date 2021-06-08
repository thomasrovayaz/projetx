import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import moment from 'moment';
import {LocationValue} from './create/components/LocationPicker';
import {getMe} from '../user/usersApi';

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
  other,
}
export enum EventParticipation {
  going,
  maybe,
  notanswered,
  notgoing,
}
export enum EventDateType {
  poll = 'poll',
  fixed = 'fixed',
}

export class ProjetXEvent {
  public id: string;
  public author: string | undefined;
  public title: string | undefined;
  public description: string | undefined;
  public type: EventType | undefined;
  public dateType: EventDateType;
  public date: DateValue | undefined;
  public datePoll: string | undefined;
  public time: moment.Moment | undefined;
  public location: LocationValue | undefined;
  public participations: Record<string, EventParticipation> = {};
  public shareLink: string = '';

  constructor({
    id,
    author,
    title,
    description,
    type,
    dateType,
    date,
    datePoll,
    time,
    location,
    participations,
    shareLink,
  }: {
    id: string;
    author?: string;
    title?: string;
    description?: string | undefined;
    type?: EventType;
    dateType?: EventDateType;
    date?: DateValue | undefined;
    datePoll?: string | undefined;
    time?: moment.Moment | undefined;
    location?: LocationValue | undefined;
    participations?: Record<string, EventParticipation>;
    shareLink?: string;
  }) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.description = description;
    this.type = type;
    this.dateType = dateType || EventDateType.fixed;
    this.date = date;
    this.datePoll = datePoll;
    this.time = time;
    this.location = location;
    this.participations = participations || {};
    this.shareLink = shareLink || '';
  }
  getStartingDate(): moment.Moment | undefined {
    if (this.date) {
      if (this.date.date) {
        return this.time
          ? this.date.date?.hours(this.time.hour())?.minutes(this.time.minute())
          : this.date.date;
      } else if (this.date.startDate) {
        return this.date.startDate;
      }
    }
    return undefined;
  }
  isAuthor(): Boolean {
    return getMe().uid === this.author;
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
export const dateConverter = {
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
    return new ProjetXEvent({
      ...data,
      id: snapshot.key,
      date: dateConverter.fromFirestore(data.date),
      time: timeConverter.fromFirestore(data.time),
    });
  },
  fromLocalStorage(data: any): ProjetXEvent {
    return new ProjetXEvent({
      ...data,
      date: dateConverter.fromFirestore(data.date),
      time: timeConverter.fromFirestore(data.time),
    });
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
