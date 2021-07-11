import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {dateConverter, DateValue} from '../events/eventsTypes';
import {LocationValue} from '../events/create/components/LocationPicker';
import moment from 'moment';

export enum PollType {
  DATE = 'DATE',
  LOCATION = 'LOCATION',
  OTHER = 'OTHER',
}
export enum PollState {
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED',
}

export class ProjetXPoll<Type = DateValue | LocationValue | string> {
  public id: string;
  public parentId?: string;
  public parentEventId?: string;
  public created: moment.Moment = moment();
  public author?: string;
  public title?: string;
  public type: PollType;
  public state: PollState = PollState.RUNNING;
  public choices: {id: string; value: Type | undefined}[] = [];
  public answers: Record<string, string[]> = {};
  public settings: {multiple: boolean; custom: boolean} = {
    multiple: true,
    custom: false,
  };
  public shareLink: string;

  constructor({
    id,
    parentId,
    parentEventId,
    created,
    title,
    author,
    type,
    state,
    choices,
    answers,
    settings,
    shareLink,
  }: {
    id: string;
    parentId?: string;
    parentEventId?: string;
    created?: moment.Moment;
    title?: string;
    author?: string;
    type: PollType;
    state: PollState;
    choices?: {id: string; value: Type | undefined}[];
    answers?: Record<string, string[]>;
    settings?: {multiple: boolean; custom: boolean};
    shareLink?: string;
  }) {
    this.id = id;
    this.parentId = parentId;
    this.parentEventId = parentEventId;
    this.created = created || moment();
    this.type = type;
    this.state = state;
    this.choices = choices || [];
    this.answers = answers || {};
    this.settings = settings || {multiple: true, custom: false};
    this.shareLink = shareLink || '';
    this.author = author;
    this.title = title;
  }
}

const convertOldState = (oldState: number): PollState => {
  switch (oldState) {
    case 0:
      return PollState.RUNNING;
    case 1:
      return PollState.FINISHED;
  }
  return PollState.FINISHED;
};
const convertOldType = (oldType: number): PollType => {
  switch (oldType) {
    case 0:
      return PollType.DATE;
    case 1:
      return PollType.LOCATION;
  }
  return PollType.OTHER;
};

export const pollConverter = {
  fromFirestore(snapshot: FirebaseDatabaseTypes.DataSnapshot): ProjetXPoll {
    const data = snapshot.val();
    return pollConverter.fromLocalStorage(data);
  },
  fromLocalStorage(data: any): ProjetXPoll {
    data.type = Number.isInteger(data.type)
      ? convertOldType(data.type)
      : data.type;
    data.state = Number.isInteger(data.state)
      ? convertOldState(data.state)
      : data.state;
    data.created = moment(data.created);
    switch (data.type) {
      case PollType.DATE:
        return new ProjetXPoll<DateValue>({
          ...data,
          choices:
            data.choices &&
            data.choices.map((choice: any) => ({
              id: choice.id,
              value: dateConverter.fromFirestore(choice.value),
            })),
        });
      case PollType.LOCATION:
        return new ProjetXPoll<LocationValue>(data);
      case PollType.OTHER:
        return new ProjetXPoll<string>(data);
      default:
        throw new Error('Unknown type');
    }
  },
  toFirestore(poll?: ProjetXPoll) {
    if (!poll) {
      return undefined;
    }
    return {
      ...poll,
      created: poll.created.format(),
      choices: poll.choices.map(choice => {
        if (poll.type === PollType.DATE) {
          const dateValue = choice.value as DateValue;
          return {
            id: choice.id,
            value: dateConverter.toFirestore(dateValue),
          };
        }
        return choice;
      }),
    };
  },
};
