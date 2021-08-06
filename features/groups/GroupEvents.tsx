import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {translate} from '../../app/locales';
import {useAppDispatch, useAppSelector} from '../../app/redux';
import EventsList from '../events/list/EventsList';
import {createEvent, selectGroupEvents} from '../events/eventsSlice';
import Button from '../../common/Button';
import {useNavigation} from '@react-navigation/native';
import {selectGroup} from './groupsSlice';

interface ProjetXGroupEventsProps {
  groupId: string;
}

const GroupEvents: React.FC<ProjetXGroupEventsProps> = ({groupId}) => {
  const navigation = useNavigation();
  const group = useAppSelector(selectGroup(groupId));
  const events = useAppSelector(selectGroupEvents(groupId));
  const [participants, setParticipants] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!group) {
      return;
    }
    setParticipants(Object.keys(group.users));
  }, [group]);

  const onOpenEvent = (eventId: string, chat?: boolean) => {
    navigation.navigate('Event', {eventId, chat});
  };

  const onCreateEvent = () => {
    dispatch(createEvent({groupId, participants}));
    navigation.navigate('CreateEventType');
  };

  return (
    <>
      <EventsList
        events={events}
        onOpenEvent={onOpenEvent}
        onCreateEvent={onCreateEvent}
      />
      {events.length > 0 ? (
        <View style={styles.buttonCreate}>
          <Button
            style={[styles.ctaLeft]}
            variant={'outlined'}
            title={translate('Créer un événement dans ce groupe')}
            onPress={onCreateEvent}
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