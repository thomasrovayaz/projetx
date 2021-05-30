import {FirebaseDatabaseTypes} from '@react-native-firebase/database';

export class ProjetXUser {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly score: number,
    readonly oneSignalId: string,
  ) {}
}

export const userConverter = {
  fromFirestore(snapshot: FirebaseDatabaseTypes.DataSnapshot): ProjetXUser {
    const data = snapshot.val();
    return new ProjetXUser(
      snapshot.key || '',
      data.displayName,
      0,
      data.oneSignalId,
    );
  },
};
