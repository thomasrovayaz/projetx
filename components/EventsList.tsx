import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ProjetXEvent, getEvents} from '../api/Events';
import EventItem from './EventItem';

interface EventsListProps {
  onOpenEvent(event: ProjetXEvent): void;
}

const EventsList: React.FC<EventsListProps> = ({onOpenEvent}) => {
  const [events, setEvents] = useState<ProjetXEvent[]>([]);
  useEffect(() => {
    const fetchEvents = async () => {
      setEvents(await getEvents());
    };
    fetchEvents();
  }, []);

  const renderItem = ({item}: {item: ProjetXEvent}) => (
    <View style={styles.item}>
      <EventItem event={item} onPress={() => onOpenEvent(item)} />
    </View>
  );

  return (
    <FlatList
      style={styles.content}
      data={events}
      renderItem={renderItem}
      keyExtractor={item => item.id}
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
