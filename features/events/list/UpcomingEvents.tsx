import Label from '../../../common/Label';
import {translate} from '../../../app/locales';
import {FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import EventItem, {EventCardVariant} from './EventItem';
import {ProjetXEvent} from '../eventsTypes';
import {filterUpcomingEvents} from '../eventsUtils';

const UpcomingEvents: React.FC<{events: ProjetXEvent[]}> = ({events}) => {
  const navigation = useNavigation();
  const [upcomingEvents, setUpcomingEvents] = useState<ProjetXEvent[]>([]);

  useEffect(() => {
    setUpcomingEvents(filterUpcomingEvents(events));
  }, [events]);
  const onOpenEvent = (eventId: string, chat?: boolean) => {
    navigation.navigate('Event', {eventId, chat});
  };

  if (!upcomingEvents || !upcomingEvents.length) {
    return null;
  }

  return (
    <>
      <Label style={styles.label}>{translate('Évènements à venir')}</Label>
      <FlatList
        data={upcomingEvents}
        renderItem={({item}) => (
          <EventItem
            event={item}
            style={styles.card}
            variant={EventCardVariant.VERTICAL}
            onPress={() => onOpenEvent(item.id)}
          />
        )}
        horizontal
        keyExtractor={item => item.id}
        contentContainerStyle={styles.container}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  label: {
    paddingHorizontal: 20,
  },
  card: {
    marginHorizontal: 10,
  },
});

export default UpcomingEvents;