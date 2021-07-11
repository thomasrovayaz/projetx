import Label from '../../../common/Label';
import {translate} from '../../../app/locales';
import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import {useAppSelector} from '../../../app/redux';
import {selectUpcomingEvents} from '../eventsSlice';
import {useNavigation} from '@react-navigation/native';
import EventItem, {EventCardVariant} from './EventItem';

const UpcomingEvents = () => {
  const navigation = useNavigation();
  const upcomingEvents = useAppSelector(selectUpcomingEvents);
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
