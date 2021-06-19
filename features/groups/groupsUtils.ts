import dynamicLinks, {firebase} from '@react-native-firebase/dynamic-links';
import {ProjetXGroup} from './groupsTypes';
import {translate} from '../../app/locales';
import {ShareUrl} from '../../app/share';

export const ShareGroup = async (group: ProjetXGroup) => {
  return ShareUrl(
    group.name || '',
    translate('Rejoins le groupe'),
    group.shareLink || '',
  );
};

export async function buildLink(group: ProjetXGroup) {
  return await dynamicLinks().buildShortLink(
    {
      link: `https://projetx.page.link/group/${group.id}`,
      domainUriPrefix: 'https://projetx.page.link',
      ios: {
        bundleId: 'com.ProjetX',
        appStoreId: '1569675082',
      },
      android: {
        packageName: 'com.projetx',
      },
      social: {
        title: group.name,
        descriptionText: translate('Rejoins ce groupe'),
      },
    },
    firebase.dynamicLinks.ShortLinkType.SHORT,
  );
}
