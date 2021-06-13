import database from '@react-native-firebase/database';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {ProjetXUser, userConverter} from './usersTypes';
import {store} from '../../app/store';
import {fetchUsers} from './usersSlice';

export const getMe = (): FirebaseAuthTypes.User => {
  const me = auth().currentUser;
  if (!me) {
    throw new Error('User not connected');
  }
  return me;
};
export const isRegistered = () => {
  const me = auth().currentUser;
  return Boolean(me && me.displayName);
};

export async function updateMyName(name: string) {
  const me = getMe();
  if (me.displayName === name || !name || name === '') {
    return;
  }
  await database().ref(`users/${me.uid}/displayName`).set(name);
  await me.updateProfile({displayName: name});
}
export async function updateOneSignalId(oneSignalId: string, userId: string) {
  if (!oneSignalId || oneSignalId === '') {
    return;
  }
  await database().ref(`users/${userId}/oneSignalId`).set(oneSignalId);
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
