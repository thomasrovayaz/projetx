import {translate} from '../../app/locales';
import {Platform} from 'react-native';
import Share from 'react-native-share';
import {EventType, ProjetXEvent} from './eventsTypes';
import dynamicLinks, {firebase} from '@react-native-firebase/dynamic-links';

export interface EventTypes {
  id: EventType;
  title: string;
}

export const eventTypes: EventTypes[] = [
  {id: EventType.diner, title: translate('Dîner')},
  {id: EventType.party, title: translate('Soirée')},
  {id: EventType.sport, title: translate('Sortie sport')},
  {id: EventType.weekend, title: translate('Weekend')},
  {id: EventType.week, title: translate('Semaine de vacance')},
  {id: EventType.travel, title: translate('Voyage loiiin')},
];
export const eventTypeTitle = (id: EventType | undefined) => {
  return eventTypes.find(eventType => eventType.id === id)?.title;
};

export const ShareEvent = async (event: ProjetXEvent) => {
  const url = event.shareLink;
  const title = event.title;
  const message = event.description ? event.description : '';
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

export async function buildLink(event: ProjetXEvent) {
  return await dynamicLinks().buildShortLink(
    {
      link: `https://projetx.page.link/event/${event.id}`,
      domainUriPrefix: 'https://projetx.page.link',
      ios: {
        bundleId: 'com.ProjetX',
        appStoreId: '1569675082',
      },
      android: {
        packageName: 'com.projetx',
      },
      social: {title: event.title, descriptionText: event.description},
    },
    firebase.dynamicLinks.ShortLinkType.SHORT,
  );
}
