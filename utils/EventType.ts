import {translate} from '../locales';

export interface EventType {
  id: 'sport' | 'diner' | 'party' | 'weekend' | 'week' | 'travel';
  title: string;
}

export const eventTypes: EventType[] = [
  {id: 'diner', title: translate('Diner entre amis')},
  {id: 'party', title: translate('Soirée entre potes')},
  {id: 'sport', title: translate('Sortie sport')},
  {id: 'weekend', title: translate('Weekend posey')},
  {id: 'week', title: translate('Semaine de défoulement')},
  {id: 'travel', title: translate('Voyage loiiin')},
];

export const eventTypeTitle = (id: string) => {
  return eventTypes.find(eventType => eventType.id === id)?.title;
};
