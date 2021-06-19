import dynamicLinks, {firebase} from '@react-native-firebase/dynamic-links';
import {PollType, ProjetXPoll} from './pollsTypes';
import {translate} from '../../app/locales';
import {ShareUrl} from '../../app/share';
import {PollTypes} from './CreatePollType';

export const pollTypes: PollTypes[] = [
  {id: PollType.DATE, title: translate('Sondage de date')},
  //{id: PollType.LOCATION, title: translate('Sondage de localisation')},
  {id: PollType.OTHER, title: translate('Autre 🤔')},
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
