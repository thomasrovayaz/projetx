import {ProjetXEvent} from '../eventsTypes';
import React, {useCallback} from 'react';
import {getEvent} from '../eventsApi';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import EventDate from '../common/EventDate';
import EventDescription from '../common/EventDescription';
import EventLocation from '../common/EventLocation';
import EventParticipants from '../common/EventParticipants';
import EventCTAs from '../common/EventCTAs';

interface EventDetailsProps {
  event: ProjetXEvent;
  componentId: string;
}
const EventDetails: React.FC<EventDetailsProps> = ({event, componentId}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = useCallback(() => {
    const fetchEvent = async () => {
      setRefreshing(true);
      await getEvent(event.id);
      setRefreshing(false);
    };
    fetchEvent();
  }, [event]);

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <EventDate event={event} componentId={componentId} />
        <EventDescription event={event} componentId={componentId} />
        <EventParticipants event={event} withLabel componentId={componentId} />
        <EventLocation event={event} componentId={componentId} />
      </ScrollView>
      <View style={styles.ctas}>
        <EventCTAs event={event} componentId={componentId} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },
  ctas: {
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default EventDetails;
