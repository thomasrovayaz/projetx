import database from '@react-native-firebase/database';
import {getMyEvents} from '../events/eventsApi';
import auth from '@react-native-firebase/auth';
import {ProjetXUser, userConverter} from './usersTypes';
import {EventParticipation} from '../events/eventsTypes';
import {store} from '../../app/store';
import {fetchUsers} from './usersSlice';

export const getMe = () => {
  return auth().currentUser;
};

export async function updateMyName(name: string) {
  const me = getMe();
  if (!me || me.displayName === name || !name || name === '') {
    return;
  }
  await database().ref(`users/${me.uid}/displayName`).set(name);
  await me.updateProfile({displayName: name});
}
export async function updateOneSignalId(id: string) {
  const me = getMe();
  if (!me || !id || id === '') {
    return;
  }
  await database().ref(`users/${me.uid}/oneSignalId`).set(id);
}

export async function getUsers() {
  const usersDb = await database().ref('users').orderByKey().once('value');
  const users: ProjetXUser[] = [];
  usersDb.forEach(userDb => {
    users.push(userConverter.fromFirestore(userDb));
    return undefined;
  });
  store.dispatch(fetchUsers(users));
  return users;
}

export async function getMyFriends(): Promise<ProjetXUser[]> {
  const myEvents = await getMyEvents();
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
  const users = await getUsers();
  return users
    .filter(({id}) => id !== getMe()?.uid)
    .map(user => ({...user, score: friendsScore[user.id]}))
    .sort((friend1, friend2) => {
      return friend1.score - friend2.score;
    });
}
