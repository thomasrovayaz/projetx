import {pollConverter, PollState, PollType, ProjetXPoll} from './pollsTypes';
import database from '@react-native-firebase/database';
import {store} from '../../app/store';
import {updateAnswers, updatePoll} from './pollsSlice';
import {getMyId} from '../user/usersApi';
import {nanoid} from 'nanoid';
import {buildLink} from './pollsUtils';
import moment from 'moment';
import {DateValue} from '../events/eventsTypes';
import {LocationValue} from '../events/create/components/LocationPicker';

export async function getPoll(id: string): Promise<ProjetXPoll> {
  const pollDb = await database().ref(`polls/${id}`).once('value');
  const poll = pollConverter.fromFirestore(pollDb);
  store.dispatch(updatePoll(poll));
  return poll;
}
export async function savePoll(poll: ProjetXPoll): Promise<ProjetXPoll> {
  if (!poll.id) {
    poll.id = nanoid();
  }
  if (!poll.created) {
    poll.created = moment();
  }
  if (!poll.author) {
    poll.author = getMyId();
  }
  if (!poll.shareLink) {
    poll.shareLink = await buildLink(poll);
  }
  await database().ref(`polls/${poll.id}`).set(pollConverter.toFirestore(poll));
  const updatedPoll = pollConverter.fromFirestore(
    await database().ref(`polls/${poll.id}`).once('value'),
  );
  store.dispatch(updatePoll(updatedPoll));
  return updatedPoll;
}
export function createPoll(type: PollType, parentEventId: string): ProjetXPoll {
  const data = {
    id: nanoid(),
    author: getMyId(),
    parentEventId,
    created: moment(),
    type,
    state: PollState.RUNNING,
    choices: [
      {id: nanoid(), value: undefined},
      {id: nanoid(), value: undefined},
    ],
  };
  switch (data.type) {
    case PollType.DATE:
      return new ProjetXPoll<DateValue>(data);
    case PollType.LOCATION:
      return new ProjetXPoll<LocationValue>(data);
    default:
      throw new Error('Unknown type');
  }
}
export async function updatePollAnswers(
  poll: ProjetXPoll,
  answers: string[],
): Promise<void> {
  await database().ref(`polls/${poll.id}/answers/${getMyId()}`).set(answers);
  store.dispatch(updateAnswers({pollId: poll.id, answers}));
}
