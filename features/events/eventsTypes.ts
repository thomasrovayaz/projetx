import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import moment from 'moment';
import {LocationValue} from './create/components/LocationPicker';
import {getMe, getMyId} from '../user/usersApi';
import {useAppSelector} from '../../app/redux';
import {EventReminder, selectReminder} from './eventsSlice';

export interface DateValue {
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  date?: moment.Moment;
}

export enum EventType {
  sport = 'sport',
  diner = 'diner',
  party = 'party',
  weekend = 'weekend',
  week = 'week',
  travel = 'travel',
  other = 'other',
}
export enum EventParticipation {
  going = 'going',
  maybe = 'maybe',
  notanswered = 'notanswered',
  notgoing = 'notgoing',
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
  public groups: Record<string, boolean> = {};
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
    groups,
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
    groups?: Record<string, boolean>;
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
    this.groups = groups || {};
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
  getEndingDate(): moment.Moment | undefined {
    if (this.date) {
      if (this.date.date) {
        return this.getStartingDate();
      } else if (this.date.endDate) {
        return this.date.endDate;
      }
    }
    return undefined;
  }
  isAuthor(): Boolean {
    return getMyId() === this.author;
  }
  isFinished(): Boolean {
    return Boolean(
      !this.getEndingDate()?.isAfter(moment().set({hours: 0, minutes: 0})),
    );
  }
  isRunning(): Boolean {
    return (
      !this.isFinished() && Boolean(this.getStartingDate()?.isBefore(moment()))
    );
  }
  isWaitingForAnswer(): Boolean {
    return (
      !this.isFinished() &&
      [EventParticipation.notanswered, EventParticipation.maybe].includes(
        this.participations[getMyId()],
      )
    );
  }
  canReportAnswer(reminder: EventReminder | undefined): Boolean {
    const startingDate = this.getStartingDate();
    const isBeforeTommorrow =
      startingDate &&
      startingDate.isBefore(moment().add({day: 1}).subtract({hour: 1}));
    const hasReminder =
      reminder && reminder.date && moment(reminder.date).isAfter(moment());
    return Boolean(!hasReminder && !isBeforeTommorrow);
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
const convertOldType = (oldType: number): EventType => {
  switch (oldType) {
    case 0:
      return EventType.sport;
    case 1:
      return EventType.diner;
    case 2:
      return EventType.party;
    case 3:
      return EventType.weekend;
    case 4:
      return EventType.week;
    case 5:
      return EventType.travel;
  }
  return EventType.other;
};
const convertOldParticipation = (
  oldParticipation: number,
): EventParticipation => {
  switch (oldParticipation) {
    case 0:
      return EventParticipation.going;
    case 1:
      return EventParticipation.maybe;
    case 2:
      return EventParticipation.notanswered;
    case 3:
      return EventParticipation.notgoing;
  }
  return EventParticipation.notanswered;
};
const convertOldParticipations = (oldParticipations: {
  [uid: string]: number | EventParticipation;
}): Record<string, EventParticipation> => {
  const participations: Record<string, EventParticipation> = {};
  if (oldParticipations) {
    for (const userId in oldParticipations) {
      if (oldParticipations.hasOwnProperty(userId)) {
        if (typeof oldParticipations[userId] === 'string') {
          participations[userId] = oldParticipations[
            userId
          ] as EventParticipation;
        } else {
          participations[userId] = convertOldParticipation(
            oldParticipations[userId] as number,
          );
        }
      }
    }
  }
  return participations;
};
export const eventConverter = {
  fromFirestore(snapshot: FirebaseDatabaseTypes.DataSnapshot): ProjetXEvent {
    const data = snapshot.val();
    if (data.participations) {
      for (const userId in data.participations) {
        if (
          data.participations.hasOwnProperty(userId) &&
          Number.isInteger(data.participations[userId])
        ) {
          data.participations[userId] = convertOldParticipation(
            data.participations[userId],
          );
        }
      }
    }
    return new ProjetXEvent({
      ...data,
      id: snapshot.key,
      participations: convertOldParticipations(data.participations),
      type: Number.isInteger(data.type) ? convertOldType(data.type) : data.type,
      date: dateConverter.fromFirestore(data.date),
      time: timeConverter.fromFirestore(data.time),
    });
  },
  fromLocalStorage(data: any): ProjetXEvent {
    return new ProjetXEvent({
      ...data,
      participations: convertOldParticipations(data.participations),
      type: Number.isInteger(data.type) ? convertOldType(data.type) : data.type,
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
