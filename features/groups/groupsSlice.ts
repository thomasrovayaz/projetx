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
      for (const group of action.payload) {
        if (group.id) {
          state.list[group.id] = group;
        }
      }
    },
    updateGroup(state, action: PayloadAction<ProjetXGroup>) {
      const group = action.payload;
      if (group.id) {
        state.list[group.id] = group;
      }
    },
    groupRemoved(state, action: PayloadAction<ProjetXGroup>) {
      const group = action.payload;
      if (!group.id) {
        return;
      }
      delete state.list[group.id];
    },
  },
});

export const {fetchGroups, updateGroup, groupRemoved} = groupsSlice.actions;

export const selectMyGroups = (
  state: RootState,
): {[id: string]: ProjetXGroup} => state.groups.list;

export const selectGroup =
  (id: string | undefined) =>
  (state: RootState): ProjetXGroup | undefined =>
    state.groups.list && id && state.groups.list[id];

export default groupsSlice.reducer;