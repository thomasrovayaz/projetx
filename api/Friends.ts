import {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {getEvents} from './Events';

export class ProjetXUser {
  constructor(readonly id: string, readonly name: string) {}
}
const userConverter = {
  fromFirestore(snapshot: FirebaseDatabaseTypes.DataSnapshot): ProjetXUser {
    const data = snapshot.val();
    return new ProjetXUser(data.id, data.name);
  },
};

export async function getMyFriends(): Promise<ProjetXUser[]> {
  const myEvents = await getEvents();
  const friendsScore: any = {};
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
    myEvent.participants.going.map(treatParticipants);
    myEvent.participants.maybe.map(treatParticipants);
  }
  return Object.keys(friendsScore)
    .sort((friend1, friend2) => {
      return friendsScore[friend1] - friendsScore[friend2];
    })
    .map(friend => new ProjetXUser(friend, friend));
}
