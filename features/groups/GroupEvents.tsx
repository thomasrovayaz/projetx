import React from 'react';
import {StyleSheet, View} from 'react-native';
import {translate} from '../../app/locales';
import {useAppDispatch, useAppSelector} from '../../app/redux';
import EventsList from '../events/list/EventsList';
import {useSelector} from 'react-redux';
import {createEvent, openEvent, selectGroupEvents} from '../events/eventsSlice';
import {ProjetXEvent} from '../events/eventsTypes';
import {Navigation} from 'react-native-navigation';
import Button from '../../common/Button';
import CreateEventTonight from '../events/create/components/CreateEventTonight';
import {selectGroup} from './groupsSlice';

interface ProjetXGroupEventsProps {
  groupId: string;
  componentId: string;
}

const GroupEvents: React.FC<ProjetXGroupEventsProps> = ({
  groupId,
  componentId,
}) => {
  const group = useAppSelector(selectGroup(groupId));
  const events = useAppSelector(selectGroupEvents(groupId));
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
          style={[styles.ctaLeft]}
          title={translate('Créer un événement')}
          onPress={() => dispatch(createEvent(componentId))}
        />
        <CreateEventTonight
          group={group}
          style={[styles.ctaRight]}
          componentId={componentId}
        />
      </View>
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
