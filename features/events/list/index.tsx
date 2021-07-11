import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {translate} from '../../../app/locales';
import Title from '../../../common/Title';
import EventsList from './EventsList';
import {ProjetXEvent} from '../eventsTypes';
import {selectMyEvents} from '../eventsSlice';
import {useAppSelector} from '../../../app/redux';
import {useNavigation} from '@react-navigation/native';

const EventListScreen: React.FC<{
  event?: ProjetXEvent;
}> = ({event}) => {
  const navigation = useNavigation();
  const events = useAppSelector(selectMyEvents);

  const onOpenEvent = (eventId: string, chat?: boolean) => {
    navigation.navigate('Event', {eventId, chat});
  };

  useEffect(() => {
    if (event) {
      onOpenEvent(event.id);
    }
  }, [event]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Title style={styles.title}>{translate('Mes événements')}</Title>
      <EventsList
        events={events}
        onOpenEvent={onOpenEvent}
        style={styles.content}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    paddingBottom: 100,
    marginTop: 10,
  },
  title: {
    marginHorizontal: 20,
    marginBottom: 5,
    marginTop: 40,
    textAlign: 'left',
  },
  buttonCreate: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  ctaLeft: {
    flex: 1,
    marginRight: 5,
  },
  ctaRight: {
    flex: 1,
    marginLeft: 5,
  },
});

export default EventListScreen;
