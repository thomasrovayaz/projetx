import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {ProjetXEvent} from '../eventsTypes';
import Title from '../../../common/Title';
import EventCTAs from '../common/EventCTAs';
import EventParticipants from '../common/EventParticipants';
import {eventTypeTitle} from '../eventsUtils';

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
