import {translate} from '../../app/locales';
import {Platform} from 'react-native';
import Share from 'react-native-share';
import {EventType, ProjetXEvent} from './eventsTypes';
import dynamicLinks, {firebase} from '@react-native-firebase/dynamic-links';
import {ShareOptions} from 'react-native-share/lib/typescript/types';
import {ActivityItem} from 'react-native-share/src/types';

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
  {id: EventType.other, title: translate('Autre 🤔')},
];
export const eventTypeTitle = (id: EventType | undefined) => {
  return eventTypes.find(eventType => eventType.id === id)?.title;
};

export const ShareEvent = async (event: ProjetXEvent) => {
  const url = event.shareLink || '';
  const title = event.title || '';
  const message = event.description ? event.description : '';
  const icon = 'data:<data_type>/<file_extension>;base64,<base64_data>';
  const iosItemText: ActivityItem = {
    type: 'text',
    content: `${message} ${url}`,
  };
  const iosItemURL: ActivityItem = {
    type: 'url',
    content: url,
  };
  const options: ShareOptions = Platform.select<ShareOptions>({
    ios: {
      title,
      subject: title,
      message: `${title} ${url}`,
      failOnCancel: false,
      activityItemSources: [
        {
          placeholderItem: iosItemURL,
          item: {
            default: iosItemURL,
            addToReadingList: iosItemURL,
            airDrop: iosItemURL,
            assignToContact: iosItemURL,
            copyToPasteBoard: iosItemURL,
            mail: iosItemURL,
            message: iosItemURL,
            openInIBooks: iosItemURL,
            postToFacebook: iosItemURL,
            postToFlickr: iosItemURL,
            postToTencentWeibo: iosItemURL,
            postToTwitter: iosItemURL,
            postToVimeo: iosItemURL,
            postToWeibo: iosItemURL,
            print: iosItemURL,
            saveToCameraRoll: iosItemURL,
            markupAsPDF: iosItemURL,
          },
          subject: {
            default: title,
            addToReadingList: title,
            airDrop: title,
            assignToContact: title,
            copyToPasteBoard: title,
            mail: title,
            message: title,
            openInIBooks: title,
            postToFacebook: title,
            postToFlickr: title,
            postToTencentWeibo: title,
            postToTwitter: title,
            postToVimeo: title,
            postToWeibo: title,
            print: title,
            saveToCameraRoll: title,
            markupAsPDF: title,
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
            default: iosItemText,
            addToReadingList: iosItemText,
            airDrop: iosItemText,
            assignToContact: iosItemText,
            copyToPasteBoard: iosItemURL,
            mail: iosItemText,
            message: iosItemText,
            openInIBooks: iosItemText,
            postToFacebook: iosItemURL,
            postToFlickr: iosItemURL,
            postToTencentWeibo: iosItemURL,
            postToTwitter: iosItemURL,
            postToVimeo: iosItemURL,
            postToWeibo: iosItemURL,
            print: iosItemURL,
            saveToCameraRoll: iosItemText,
            markupAsPDF: iosItemText,
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
