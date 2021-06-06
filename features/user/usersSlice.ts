import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';
import {ProjetXUser} from './usersTypes';
import {EventParticipation} from '../events/eventsTypes';
import {getMe} from './usersApi';
import {selectMyEvents} from '../events/eventsSlice';

interface UsersState {
  list: {
    [uid: string]: ProjetXUser;
  };
}

const initialState: UsersState = {list: {}};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsers(state, action: PayloadAction<ProjetXUser[]>) {
      state.list = {};
      for (const user of action.payload) {
        state.list[user.id] = user;
      }
    },
    updateUser(state, action: PayloadAction<ProjetXUser>) {
      const user = action.payload;
      state.list[user.id] = user;
    },
  },
});

export const {fetchUsers, updateUser} = usersSlice.actions;

export const selectUsers = (state: RootState): {[id: string]: ProjetXUser} =>
  state.users.list;
export const selectMyFriends = (state: RootState): ProjetXUser[] => {
  const myEvents = selectMyEvents(state);
  const friendsScore: {[uid: string]: number} = {};
  const treatParticipants = (friendId: string) => {
    if (!friendId && friendId === '') {
      return;
    }
    if (friendsScore[friendId]) {
      friendsScore[friendId]++;
    } else {
      friendsScore[friendId] = 1;
    }
  };

  for (const myEvent of myEvents) {
    myEvent.participations &&
      Object.keys(myEvent.participations)
        .filter(userId =>
          [EventParticipation.going, EventParticipation.maybe].includes(
            myEvent.participations[userId],
          ),
        )
        .map(treatParticipants);
  }
  const users = Object.values(selectUsers(state));
  return users
    .filter(({id}) => id !== getMe().uid)
    .map(user => ({...user, score: friendsScore[user.id]}))
    .sort((friend1, friend2) => {
      return friend1.score - friend2.score;
    });
};

export default usersSlice.reducer;
