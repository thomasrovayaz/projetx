import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {pollConverter, ProjetXPoll} from './pollsTypes';
import {RootState} from '../../app/store';
import {createTransform} from 'redux-persist';
import {getMyId} from '../user/usersApi';

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
    fetchPolls(state, action: PayloadAction<ProjetXPoll[]>) {
      if (!state.list) {
        state.list = {};
      }
      for (const poll of action.payload) {
        state.list[poll.id] = poll;
      }
    },
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
        state.current.answers[getMyId()] = answers;
      }
      state.list[pollId] = {
        ...state.list[pollId],
        answers: {
          ...state.list[pollId].answers,
          [getMyId()]: answers,
        },
      };
    },
  },
});

export const {fetchPolls, updatePoll, updateAnswers} = pollsSlice.actions;
export const selectPoll = (pollId: string | undefined) => (state: RootState) =>
  pollId ? state.polls.list[pollId] : undefined;
export const selectPolls = (parentId: string) => (state: RootState) =>
  Object.values<ProjetXPoll>(state.polls.list).filter(
    poll => poll.parentEventId === parentId || poll.parentId === parentId,
  );

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