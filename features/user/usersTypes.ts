import {FirebaseDatabaseTypes} from '@react-native-firebase/database';

export class ProjetXUser {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly avatar: {small: string | undefined; big: string | undefined},
    readonly score: number,
    readonly oneSignalId: string,
    readonly settings: {[key: string]: string | boolean} = {},
  ) {}
}

export const userConverter = {
  fromFirestore(snapshot: FirebaseDatabaseTypes.DataSnapshot): ProjetXUser {
    const data = snapshot.val();
    return new ProjetXUser(
      snapshot.key || '',
      data.displayName,
      data.description,
      data.avatar,
      0,
      data.oneSignalId,
      data.settings,
    );
  },
};

export enum VisibilitySettings {
  all = 'all',
  friends = 'friends',
  never = 'never',
}