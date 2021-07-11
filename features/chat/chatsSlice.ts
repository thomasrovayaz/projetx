import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';
import {ProjetXMessage} from './chatsTypes';
import {selectAmIParticipating} from '../events/eventsSlice';
import {ProjetXEvent} from '../events/eventsTypes';
import moment from 'moment';
import {ProjetXGroup} from '../groups/groupsTypes';

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

const sortChats = (chatA: ProjetXMessage[], chatB: ProjetXMessage[]) => {
  if (!chatB.length) {
    return 1;
  }
  if (!chatA.length) {
    return -1;
  }
  const latestAMessage = chatA[0];
  const latestBMessage = chatB[0];
  if (moment(latestAMessage.createdAt).isAfter(latestBMessage.createdAt)) {
    return -1;
  }
  return 1;
};

export interface ProjetXChat {
  id: string;
  latestMessage: ProjetXMessage;
  messages: ProjetXMessage[];
  event?: ProjetXEvent;
  group: ProjetXGroup;
  unreadMessages: number;
}
export const selectLatestChats = (state: RootState): ProjetXChat[] => {
  const chatParentIds = Object.keys(state.chats.list);
  return chatParentIds
    .filter(
      id =>
        Boolean(state.events.list[id] || state.groups.list[id]) &&
        state.chats.list[id].length > 0,
    )
    .sort((idA, idB) => sortChats(state.chats.list[idA], state.chats.list[idB]))
    .map(id => {
      const messages = state.chats.list[id];
      const latestMessage = messages[0];
      return {
        id,
        event: state.events.list[id],
        group: state.groups.list[id],
        latestMessage,
        messages: state.chats.list[id],
        unreadMessages: selectUnreadMessageCount(id)(state),
      };
    });
};

export default chatsSlice.reducer;
