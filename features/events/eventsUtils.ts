import {translate} from '../../app/locales';
import {EventParticipation, EventType, ProjetXEvent} from './eventsTypes';
import dynamicLinks, {firebase} from '@react-native-firebase/dynamic-links';
import {ShareUrl} from '../../app/share';
import {DARK_BLUE, LIGHT_BLUE} from '../../app/colors';
import {getMyId} from '../user/usersApi';
import {sortEvents} from './eventsSlice';

export interface EventTypes {
  id: EventType;
  title: string;
  emoji: string;
  color: string;
  bgColor: string;
}

const defaultEventInfos = {
  id: EventType.other,
  title: translate('Autre'),
  emoji: '🤔',
  color: DARK_BLUE,
  bgColor: LIGHT_BLUE,
};
export const eventTypes: EventTypes[] = [
  {
    id: EventType.party,
    title: translate('Soirée'),
    emoji: '🍻',
    color: '#a31e8f',
    bgColor: '#fdeef5',
  },
  {
    id: EventType.sport,
    title: translate('Sport'),
    emoji: '🏋️',
    color: '#f37740',
    bgColor: '#ffeae3',
  },
  {
    id: EventType.weekend,
    title: translate('Weekend'),
    emoji: '🚣',
    color: '#91D683',
    bgColor: '#EAFAE7',
  },
  {
    id: EventType.week,
    title: translate('Semaine de vacance'),
    emoji: '🏖',
    color: '#F0C300',
    bgColor: '#FFF7D7',
  },
  {
    id: EventType.travel,
    title: translate('Voyage loiiin'),
    emoji: '🛫',
    color: '#30D5C8',
    bgColor: '#E5FEFC',
  },
  defaultEventInfos,
];
export const eventTypeInfos = (id: EventType | undefined): EventTypes => {
  return eventTypes.find(eventType => eventType.id === id) || defaultEventInfos;
};
export const eventTypeTitle = (id: EventType | undefined) => {
  return eventTypeInfos(id).title;
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

export const filterEventsWaitingForAnswers = (
  events: ProjetXEvent[],
): ProjetXEvent[] => {
  if (!events) {
    return [];
  }
  return events
    .filter(event => {
      return (
        !event.isFinished() &&
        [EventParticipation.maybe, EventParticipation.notanswered].includes(
          event.participations[getMyId()],
        )
      );
    })
    .sort((eventA, eventB) => {
      const answerA = eventA.participations[getMyId()];
      const answerB = eventB.participations[getMyId()];
      if (
        answerA === EventParticipation.maybe &&
        answerB === EventParticipation.notanswered
      ) {
        return -1;
      }
      if (
        answerA === EventParticipation.notanswered &&
        answerB === EventParticipation.maybe
      ) {
        return 1;
      }
      return sortEvents(eventA, eventB);
    });
};
export const filterUpcomingEvents = (
  events: ProjetXEvent[],
): ProjetXEvent[] => {
  if (!events) {
    return [];
  }
  return events
    .filter(
      event =>
        !event.isFinished() &&
        [EventParticipation.going].includes(event.participations[getMyId()]),
    )
    .sort(sortEvents);
};