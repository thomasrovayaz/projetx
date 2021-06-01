import {Platform} from 'react-native';
import Share from 'react-native-share';
import dynamicLinks, {firebase} from '@react-native-firebase/dynamic-links';
import {ProjetXPoll} from './pollsTypes';

export const SharePoll = async (poll: ProjetXPoll) => {
  const url = poll.shareLink;
  const title = '';
  const message = '';
  const icon = 'data:<data_type>/<file_extension>;base64,<base64_data>';
  const options = Platform.select({
    ios: {
      activityItemSources: [
        {
          placeholderItem: {type: 'url', content: url},
          item: {
            default: {type: 'url', content: url},
          },
          subject: {
            default: title,
          },
          linkMetadata: {originalUrl: url, url, title},
        },
        {
          // For using custom icon instead of default text icon at share preview when sharing with message.
          placeholderItem: {
            type: 'url',
            content: icon,
          },
          item: {
            default: {
              type: 'text',
              content: `${message} ${url}`,
            },
          },
          linkMetadata: {
            title: message,
            icon: icon,
          },
        },
      ],
    },
    default: {
      title,
      subject: title,
      message: `${title} ${url}`,
      failOnCancel: false,
    },
  });
  // @ts-ignore
  await Share.open(options);
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
