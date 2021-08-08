import database from '@react-native-firebase/database';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {ProjetXUser, userConverter} from './usersTypes';
import {store} from '../../app/store';
import {fetchUsers, selectUser, updateUser} from './usersSlice';
import ImageResizer from 'react-native-image-resizer';
import storage from '@react-native-firebase/storage';

export const getMe = (): FirebaseAuthTypes.User => {
  const me = auth().currentUser;
  if (!me) {
    throw new Error('User not connected');
  }
  return me;
};
export const getMyId = (): string => {
  //return 'hSmg2JgylMXlwLeZ5yPjCnyyaTq1';
  return getMe().uid;
};
export const isRegistered = (): boolean => {
  const me = auth().currentUser;
  return Boolean(me && me.displayName);
};

export async function updateMyName(name: string): Promise<void> {
  const me = getMe();
  if (me.displayName === name || !name || name === '') {
    return;
  }
  await database().ref(`users/${me.uid}/displayName`).set(name);
  await me.updateProfile({displayName: name});
}
export async function updateMyDescription(description: string): Promise<void> {
  await database().ref(`users/${getMyId()}/description`).set(description);
  const me = selectUser(getMyId())(store.getState());
  store.dispatch(
    updateUser({
      ...me,
      description: description,
    }),
  );
}
export async function updateOneSignalId(
  oneSignalId: string,
  userId: string,
): Promise<void> {
  if (!oneSignalId || oneSignalId === '') {
    return;
  }
  await database().ref(`users/${userId}/oneSignalId`).set(oneSignalId);
}
export async function updateSetting(
  key: string,
  selected: string | boolean,
): Promise<void> {
  if (!key || key === '') {
    return;
  }
  await database().ref(`users/${getMyId()}/settings/${key}`).set(selected);
  const me = selectUser(getMyId())(store.getState());
  store.dispatch(
    updateUser({
      ...me,
      settings: {...me.settings, [key]: selected},
    }),
  );
}

export async function updateProfilePic(uri: string | undefined) {
  const me = getMe();
  if (!uri || uri === '') {
    return;
  }
  const smallPic = await ImageResizer.createResizedImage(
    uri,
    100,
    100,
    'PNG',
    100,
    0,
    undefined,
  );
  const bigPic = await ImageResizer.createResizedImage(
    uri,
    500,
    500,
    'PNG',
    100,
    0,
    undefined,
  );
  const imageSmallName = `profile_small_${getMyId()}.png`;
  const imageBigName = `profile_small_${getMyId()}.png`;
  const smallUploadUri = smallPic.uri.replace('file://', '');
  const bigUploadUri = bigPic.uri.replace('file://', '');
  const imageSmallRef = storage().ref('/' + imageSmallName);
  const imageBigRef = storage().ref('/' + imageBigName);
  await imageSmallRef.putFile(smallUploadUri);
  await imageBigRef.putFile(bigUploadUri);
  const downloadSmallUrl = await imageSmallRef.getDownloadURL();
  const downloadBigUrl = await imageBigRef.getDownloadURL();
  const newAvatar = {small: downloadSmallUrl, big: downloadBigUrl};
  await database().ref(`users/${me.uid}/avatar`).set(newAvatar);
  await me.updateProfile({photoURL: downloadSmallUrl});
  store.dispatch(
    updateUser({
      ...selectUser(getMyId())(store.getState()),
      avatar: newAvatar,
    }),
  );
  return newAvatar;
}

export async function getUsers(): Promise<ProjetXUser[]> {
  const usersDb = await database().ref('users').orderByKey().once('value');
  const users: ProjetXUser[] = [];
  usersDb.forEach(userDb => {
    users.push(userConverter.fromFirestore(userDb));
    return undefined;
  });
  store.dispatch(fetchUsers(users));
  return users;
}
