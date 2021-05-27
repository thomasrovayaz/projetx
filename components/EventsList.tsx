import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {ProjetXEvent, getMyEvents} from '../api/Events';
import EventItem from './EventItem';

interface EventsListProps {
  componentId: string;
  onOpenEvent(event: ProjetXEvent): void;
}

const EventsList: React.FC<EventsListProps> = ({componentId, onOpenEvent}) => {
  const [events, setEvents] = useState<ProjetXEvent[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchEvents = async () => {
    setRefreshing(true);
    setEvents(await getMyEvents());
    setRefreshing(false);
  };
  const onRefresh = useCallback(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const renderItem = ({item}: {item: ProjetXEvent}) => (
    <View style={styles.item}>
      <EventItem
        event={item}
        componentId={componentId}
        onPress={() => onOpenEvent(item)}
      />
    </View>
  );

  return (
    <FlatList
      style={styles.content}
      data={events}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  content: {},
  item: {
    padding: 20,
  },
});

export default EventsList;
