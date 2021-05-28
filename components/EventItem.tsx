import {ProjetXEvent} from '../api/Events';
import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Title from './Title';
import {eventTypeTitle} from '../utils/EventType';
import EventCTAs from './EventCTAs';
import EventParticipants from './EventParticipants';

interface EventItemProps {
  componentId: string;
  event: ProjetXEvent;
  onPress(event: GestureResponderEvent): void;
}

const EventItem: React.FC<EventItemProps> = ({componentId, event, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Title style={styles.title}>{event.title}</Title>
      <Text style={styles.subtitle}>{eventTypeTitle(event.type)}</Text>
      <EventParticipants
        event={event}
        hideOnEmpty
        style={styles.participants}
      />
      <EventCTAs componentId={componentId} event={event} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    textAlign: 'left',
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 5,
  },
  participants: {
    marginBottom: 5,
  },
});

export default EventItem;
