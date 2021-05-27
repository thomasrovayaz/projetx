import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {getMyEvents} from './Events';
import auth from '@react-native-firebase/auth';

export class ProjetXUser {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly score: number,
  ) {}
}
const userConverter = {
  fromFirestore(snapshot: FirebaseDatabaseTypes.DataSnapshot): ProjetXUser {
    const data = snapshot.val();
    return new ProjetXUser(snapshot.key || '', data.displayName, 0);
  },
};

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

export async function getUsers() {
  const usersDb = await database().ref('users').orderByKey().once('value');
  const users: ProjetXUser[] = [];
  usersDb.forEach(userDb => {
    users.push(userConverter.fromFirestore(userDb));
    return undefined;
  });
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
          ['going', 'maybe'].includes(myEvent.participations[userId]),
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
