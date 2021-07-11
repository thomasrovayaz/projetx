import dynamicLinks, {firebase} from '@react-native-firebase/dynamic-links';
import {PollType, ProjetXPoll} from './pollsTypes';
import {translate} from '../../app/locales';
import {ShareUrl} from '../../app/share';
import {PollTypes} from './CreatePollType';
import {addMessage} from '../chat/chatApi';
import {nanoid} from 'nanoid';
import {getMyId} from '../user/usersApi';
import {NotificationParentType} from '../../app/onesignal';

export const pollTypes: PollTypes[] = [
  {id: PollType.DATE, title: translate('Sondage de date'), icon: 'calendar'},
  //{id: PollType.LOCATION, title: translate('Sondage de localisation')},
  {id: PollType.OTHER, title: translate('Autre 🤔'), icon: 'list'},
];

export const SharePoll = async (poll: ProjetXPoll) => {
  return ShareUrl('', '', poll.shareLink);
};

export async function buildLink(poll: ProjetXPoll) {
  return await dynamicLinks().buildShortLink(
    {
      link: `https://projetx.page.link/event/${poll.parentEventId}/poll`,
      domainUriPrefix: 'https://projetx.page.link',
      ios: {
        bundleId: 'com.ProjetX',
        appStoreId: '1569675082',
      },
      android: {
        packageName: 'com.projetx',
      },
      social: {title: '', descriptionText: ''},
    },
    firebase.dynamicLinks.ShortLinkType.SHORT,
  );
}

export const sendPollMessage = async (
  poll: ProjetXPoll,
  parentId: string,
  parentTitle: string,
  usersToNotify: string[],
) => {
  return addMessage(
    {
      _id: nanoid(),
      createdAt: new Date(),
      user: {
        _id: getMyId(),
      },
      quickReplies: {
        type: poll.settings.multiple ? 'checkbox' : 'radio',
        values: [
          {
            value: 'wrong',
            title: translate(
              'Mets à jour ton appli pour voir le sondage dans le chat 😉',
            ),
          },
        ],
      },
      pollId: poll.id,
      text: poll.title || '',
    },
    {
      id: parentId,
      type: NotificationParentType.EVENT,
      title: parentTitle,
    },
    usersToNotify,
  );
};
