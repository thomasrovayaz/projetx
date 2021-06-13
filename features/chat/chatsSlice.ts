import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';
import {ProjetXMessage} from './chatsTypes';
import {selectAmIParticipating} from '../events/eventsSlice';

interface ChatsState {
  list: {
    [uid: string]: ProjetXMessage[];
  };
  read: {
    [uid: string]: number;
  };
}

const initialState: ChatsState = {list: {}, read: {}};

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    chatsUpdated(
      state,
      action: PayloadAction<{
        [uid: string]: ProjetXMessage[];
      }>,
    ) {
      state.list = action.payload;
    },
    chatRead(state, action: PayloadAction<string>) {
      const eventId = action.payload;
      if (!state.read) {
        state.read = {};
      }
      const chat = state.list[eventId];
      state.read[eventId] = chat ? chat.length : 0;
    },
  },
});

export const {chatsUpdated, chatRead} = chatsSlice.actions;

export const selectChat =
  (id: string) =>
  (state: RootState): ProjetXMessage[] =>
    state.chats.list[id];
export const selectUnreadMessageCount =
  (id?: string) =>
  (state: RootState): number => {
    if (!id || !state.chats.list[id]) {
      return 0;
    }
    if (!state.chats.read || !state.chats.read[id]) {
      return state.chats.list[id].length;
    }
    return state.chats.list[id].length - state.chats.read[id];
  };
export const selectTotalEventUnreadMessageCount = (
  state: RootState,
): number => {
  const eventIds = Object.keys(state.events.list);
  return eventIds.reduce<number>((totalCount, eventId) => {
    if (!selectAmIParticipating(eventId)(state)) {
      return totalCount;
    }
    return totalCount + selectUnreadMessageCount(eventId)(state);
  }, 0);
};
export const selectTotalGroupUnreadMessageCount = (
  state: RootState,
): number => {
  const groupIds = Object.keys(state.groups.list);
  return groupIds.reduce<number>((totalCount, groupId) => {
    return totalCount + selectUnreadMessageCount(groupId)(state);
  }, 0);
};

export default chatsSlice.reducer;
