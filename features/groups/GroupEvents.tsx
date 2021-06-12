import React from 'react';
import {StyleSheet, View} from 'react-native';
import {translate} from '../../app/locales';
import {useAppDispatch} from '../../app/redux';
import EventsList from '../events/list/EventsList';
import {useSelector} from 'react-redux';
import {createEvent, openEvent, selectGroupEvents} from '../events/eventsSlice';
import {ProjetXEvent} from '../events/eventsTypes';
import {Navigation} from 'react-native-navigation';
import Button from '../../common/Button';

interface ProjetXGroupEventsProps {
  groupId: string;
  componentId: string;
}

const GroupEvents: React.FC<ProjetXGroupEventsProps> = ({
  groupId,
  componentId,
}) => {
  const events = useSelector(selectGroupEvents(groupId));
  const dispatch = useAppDispatch();

  const onOpenEvent = (eventToOpen: ProjetXEvent, chat?: boolean) => {
    dispatch(openEvent(eventToOpen));
    Navigation.push(componentId, {
      component: {
        name: 'Event',
        passProps: {
          chat,
        },
      },
    });
  };

  return (
    <>
      <EventsList
        componentId={componentId}
        events={events}
        onOpenEvent={onOpenEvent}
        emptyText={translate(
          'Pas encore d’événement dans ce groupe.\nCréé le premier 😉',
        )}
      />
      <View style={styles.buttonCreate}>
        <Button
          title={translate('Créer un événement')}
          onPress={() => dispatch(createEvent(componentId))}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonCreate: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default GroupEvents;
