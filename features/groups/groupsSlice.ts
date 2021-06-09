import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';
import {ProjetXGroup} from './groupsTypes';

interface GroupsState {
  list: {
    [uid: string]: ProjetXGroup;
  };
}

const initialState: GroupsState = {list: {}};

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    fetchGroups(state, action: PayloadAction<ProjetXGroup[]>) {
      state.list = {};
      for (const user of action.payload) {
        state.list[user.id] = user;
      }
    },
    updateGroup(state, action: PayloadAction<ProjetXGroup>) {
      const user = action.payload;
      state.list[user.id] = user;
    },
  },
});

export const {fetchGroups, updateGroup} = groupsSlice.actions;

export const selectMyGroups = (state: RootState): ProjetXGroup[] =>
  state.groups.list && Object.values(state.groups.list);
export const selectGroup =
  (id: string | undefined) =>
  (state: RootState): ProjetXGroup =>
    state.groups.list && id && state.groups.list[id];

export default groupsSlice.reducer;
