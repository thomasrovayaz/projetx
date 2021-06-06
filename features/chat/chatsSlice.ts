import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';
import {IMessage} from 'react-native-gifted-chat/lib/Models';

interface ChatsState {
  list: {
    [uid: string]: IMessage[];
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
        [uid: string]: IMessage[];
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
  (state: RootState): IMessage[] =>
    state.chats.list[id];
export const selectUnreadMessageCount =
  (id: string) =>
  (state: RootState): number => {
    if (!id || !state.chats.list[id]) {
      return 0;
    }
    if (!state.chats.read || !state.chats.read[id]) {
      return state.chats.list[id].length;
    }
    return state.chats.list[id].length - state.chats.read[id];
  };

export default chatsSlice.reducer;
