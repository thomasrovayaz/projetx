import React from 'react';
import {StyleSheet, View} from 'react-native';
import {translate} from '../../app/locales';
import {useAppDispatch, useAppSelector} from '../../app/redux';
import EventsList from '../events/list/EventsList';
import {createEvent, selectGroupEvents} from '../events/eventsSlice';
import Button from '../../common/Button';
import {useNavigation} from '@react-navigation/native';

interface ProjetXGroupEventsProps {
  groupId: string;
}

const GroupEvents: React.FC<ProjetXGroupEventsProps> = ({groupId}) => {
  const navigation = useNavigation();
  const events = useAppSelector(selectGroupEvents(groupId));
  const dispatch = useAppDispatch();

  const onOpenEvent = (eventId: string, chat?: boolean) => {
    navigation.navigate('Event', {eventId, chat});
  };

  return (
    <>
      <EventsList events={events} onOpenEvent={onOpenEvent} />
      {events.length > 0 ? (
        <View style={styles.buttonCreate}>
          <Button
            style={[styles.ctaLeft]}
            variant={'outlined'}
            title={translate('Créer un événement dans ce groupe')}
            onPress={() => dispatch(createEvent())}
          />
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
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

export default GroupEvents;
