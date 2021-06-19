import {translate} from '../../app/locales';
import {EventType, ProjetXEvent} from './eventsTypes';
import dynamicLinks, {firebase} from '@react-native-firebase/dynamic-links';
import {ShareUrl} from '../../app/share';

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
  return ShareUrl(
    event.title || '',
    event.description || '',
    event.shareLink || '',
  );
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
