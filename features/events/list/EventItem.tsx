import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ProjetXEvent} from '../eventsTypes';
import Title from '../../../common/Title';
import EventCTAs from '../common/EventCTAs';
import EventParticipants from '../common/EventParticipants';
import {eventTypeTitle} from '../eventsUtils';
import moment from 'moment';

interface EventItemProps {
  componentId: string;
  event: ProjetXEvent;
  onPress(event: GestureResponderEvent): void;
}

const EventItem: React.FC<EventItemProps> = ({componentId, event, onPress}) => {
  const date = event.getStartingDate();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Title style={styles.title}>{event.title}</Title>
          <Text style={styles.subtitle}>{eventTypeTitle(event.type)}</Text>
        </View>
        {date ? (
          <Text
            style={[
              styles.headerDate,
              date.isBefore(moment()) ? styles.headerDatePassed : {},
            ]}>
            {date.fromNow()}
          </Text>
        ) : null}
      </View>
      <EventParticipants
        event={event}
        hideOnEmpty
        style={styles.participants}
      />
      <EventCTAs componentId={componentId} event={event} small />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15,
  },
  header: {flexDirection: 'row', alignItems: 'flex-start'},
  headerTitle: {flex: 1},
  headerDate: {
    paddingTop: 2,
    marginLeft: 5,
    fontFamily: 'Inter',
    fontSize: 14,
  },
  headerDatePassed: {
    color: 'red',
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
