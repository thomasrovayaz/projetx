import database from '@react-native-firebase/database';
import {groupConverter, ProjetXGroup} from './groupsTypes';
import {store} from '../../app/store';
import {fetchGroups, updateGroup} from './groupsSlice';
import {getMe} from '../user/usersApi';
import slugify from 'slugify';
import {nanoid} from 'nanoid';
import {buildLink} from './groupsUtils';
import {translate} from '../../app/locales';
import {
  NotificationParentType,
  NotificationType,
  postNotification,
} from '../../app/onesignal';
import {ProjetXUser} from '../user/usersTypes';
import {EventParticipation, ProjetXEvent} from '../events/eventsTypes';
import {participationUpdated} from '../events/eventsSlice';
import {notifyParticipation} from '../events/eventsApi';

export async function getGroup(id: string): Promise<ProjetXGroup> {
  const groupDb = await database().ref(`groups/${id}`).once('value');
  const group = groupConverter.fromFirestore(groupDb);
  store.dispatch(updateGroup(group));
  return group;
}

export async function getMyGroups() {
  const groupsDb = await database()
    .ref('groups')
    .orderByChild('users/' + getMe().uid)
    .equalTo(true)
    .once('value');
  const groups: ProjetXGroup[] = [];
  groupsDb.forEach(groupDb => {
    groups.push(groupConverter.fromFirestore(groupDb));
    return undefined;
  });
  store.dispatch(fetchGroups(groups));
  return groups;
}

export async function saveGroup(group: ProjetXGroup): Promise<ProjetXGroup> {
  if (!group.id) {
    group.id = `${slugify(group.name || '', {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    })}-${nanoid(11)}`;
    group.author = getMe().uid;
  }
  if (!group.shareLink) {
    group.shareLink = await buildLink(group);
  }
  await database().ref(`groups/${group.id}`).set(group);
  const updatedGroup = groupConverter.fromFirestore(
    await database().ref(`groups/${group.id}`).once('value'),
  );
  store.dispatch(updateGroup(updatedGroup));
  return updatedGroup;
}

export async function addMember(group: ProjetXGroup) {
  if (!group.id) {
    return;
  }
  await database().ref(`groups/${group.id}/users/${getMe().uid}`).set(true);
  const updatedGroup = groupConverter.fromFirestore(
    await database().ref(`groups/${group.id}`).once('value'),
  );
  store.dispatch(updateGroup(updatedGroup));
  return updatedGroup;
}

export function notifyNewGroup(
  group: ProjetXGroup,
  usersToNotify: ProjetXUser[],
) {
  if (!group.id || !usersToNotify || usersToNotify.length <= 0) {
    return;
  }

  const include_player_ids = usersToNotify
    .filter(({oneSignalId, id}) => oneSignalId && id !== getMe().uid)
    .map(({oneSignalId}) => oneSignalId);
  postNotification(
    include_player_ids,
    NotificationType.GROUP_INVITATION,
    {
      id: group.id,
      type: NotificationParentType.GROUP,
    },
    `${group.name}`,
    `${getMe().displayName} ${translate("t'as ajouté au groupe")}`,
  );
}
