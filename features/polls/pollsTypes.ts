import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {dateConverter, DateValue} from '../events/eventsTypes';
import {LocationValue} from '../events/create/components/LocationPicker';
import moment from 'moment';

export enum PollType {
  DATE,
  LOCATION,
}
export enum PollState {
  RUNNING,
  FINISHED,
}

export class ProjetXPoll<Type = DateValue | LocationValue> {
  public id: string;
  public parentEventId: string;
  public created: moment.Moment = moment();
  public author: string | undefined;
  public type: PollType;
  public state: PollState = PollState.RUNNING;
  public choices: {id: string; value: Type | undefined}[] = [];
  public answers: Record<string, string[]> = {};
  public settings: {multiple: boolean} = {multiple: false};
  public shareLink: string;

  constructor({
    id,
    parentEventId,
    created,
    author,
    type,
    state,
    choices,
    answers,
    settings,
    shareLink,
  }: {
    id: string;
    parentEventId: string;
    created: moment.Moment;
    author?: string;
    type: PollType;
    state: PollState;
    choices?: {id: string; value: Type}[];
    answers?: Record<string, string[]>;
    settings?: {multiple: boolean};
    shareLink?: string;
  }) {
    this.id = id;
    this.parentEventId = parentEventId;
    this.created = created;
    this.type = type;
    this.state = state;
    this.choices = choices || [];
    this.answers = answers || {};
    this.settings = settings || {multiple: false};
    this.shareLink = shareLink || '';
    this.author = author;
  }
}

export const pollConverter = {
  fromFirestore(snapshot: FirebaseDatabaseTypes.DataSnapshot): ProjetXPoll {
    const data = snapshot.val();
    return pollConverter.fromLocalStorage(data);
  },
  fromLocalStorage(data: any): ProjetXPoll {
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
      }),
    };
  },
};
