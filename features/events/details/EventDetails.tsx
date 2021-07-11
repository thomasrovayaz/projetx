import React, {useCallback} from 'react';
import {getEvent} from '../eventsApi';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import EventDate from '../common/EventDate';
import EventDescription from '../common/EventDescription';
import EventLocation from '../common/EventLocation';
import EventCTAs from '../common/EventCTAs';
import {useAppSelector} from '../../../app/redux';
import {selectEvent} from '../eventsSlice';
import {getUsers} from '../../user/usersApi';

interface EventDetailsProps {
  eventId: string;
}
const EventDetails: React.FC<EventDetailsProps> = ({eventId}) => {
  const event = useAppSelector(selectEvent(eventId));
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = useCallback(() => {
    const fetchEvent = async () => {
      setRefreshing(true);
      await Promise.all([getUsers(), getEvent(eventId)]);
      setRefreshing(false);
    };
    fetchEvent();
  }, [eventId]);

  if (!event) {
    return null;
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <EventDate event={event} />
        <EventDescription event={event} />
        <EventLocation event={event} />
      </ScrollView>
      <View style={styles.ctas}>
        <EventCTAs event={event} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },
  ctas: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default EventDetails;
