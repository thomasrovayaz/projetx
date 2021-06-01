import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {pollConverter, ProjetXPoll} from './pollsTypes';
import {RootState} from '../../app/store';
import {createTransform} from 'redux-persist';
import {getMe} from '../user/usersApi';

interface PollsState {
  list: {
    [uid: string]: ProjetXPoll;
  };
  current?: ProjetXPoll;
}

const initialState: PollsState = {list: {}};

export const pollsSlice = createSlice({
  name: 'polls',
  initialState,
  reducers: {
    updatePoll(state, action: PayloadAction<ProjetXPoll>) {
      const poll = action.payload;
      if (state.current && state.current.id === poll.id) {
        state.current = poll;
      }
      state.list[poll.id] = poll;
    },
    updateAnswers(
      state,
      action: PayloadAction<{pollId: string; answers: string[]}>,
    ) {
      const {pollId, answers} = action.payload;
      if (state.current && state.current.id === pollId) {
        state.current.answers[getMe().uid] = answers;
      }
      state.list[pollId].answers[getMe().uid] = answers;
    },
  },
});

export const {updatePoll, updateAnswers} = pollsSlice.actions;
export const selectPoll = (pollId: string) => (state: RootState) =>
  state.polls.list[pollId];

export default pollsSlice.reducer;

export const pollsTransform = createTransform(
  null,
  (outboundState: any) => {
    const polls: {[id: string]: ProjetXPoll} = {};
    if (outboundState.list) {
      for (const pollId in outboundState.list) {
        if (outboundState.list.hasOwnProperty(pollId)) {
          polls[pollId] = pollConverter.fromLocalStorage(
            outboundState.list[pollId],
          );
        }
      }
    }
    return {
      list: polls,
      current: outboundState.current
        ? pollConverter.fromLocalStorage(outboundState.current)
        : null,
    };
  },
  {whitelist: ['polls']},
);
