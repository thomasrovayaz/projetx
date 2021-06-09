import {FirebaseDatabaseTypes} from '@react-native-firebase/database';

export class ProjetXGroup {
  public id?: string;
  public author?: string;
  public name: string;
  public users: Record<string, boolean> = {};
  public shareLink?: string = '';

  constructor({
    id,
    author,
    name,
    users,
    shareLink,
  }: {
    id: string;
    author?: string;
    name: string;
    users?: Record<string, boolean>;
    shareLink?: string;
  }) {
    this.id = id;
    this.author = author;
    this.name = name;
    this.users = users || {};
    this.shareLink = shareLink || '';
  }
}

export const groupConverter = {
  fromFirestore(snapshot: FirebaseDatabaseTypes.DataSnapshot): ProjetXGroup {
    const data = snapshot.val();
    return new ProjetXGroup({
      ...data,
      id: snapshot.key || '',
    });
  },
};
