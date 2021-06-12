import React from 'react';
import Button from '../../../../common/Button';
import {translate} from '../../../../app/locales';
import {StyleProp, ViewStyle} from 'react-native';
import moment from 'moment';
import {
  EventDateType,
  EventParticipation,
  EventType,
  ProjetXEvent,
} from '../../eventsTypes';
import {openEvent} from '../../eventsSlice';
import {Navigation} from 'react-native-navigation';
import {useAppDispatch} from '../../../../app/redux';
import {notifyNewEvent, saveEvent, slugifyEventId} from '../../eventsApi';
import {ProjetXGroup} from '../../../groups/groupsTypes';
import {getMe} from '../../../user/usersApi';
import {useSelector} from 'react-redux';
import {selectMyFriends} from '../../../user/usersSlice';

interface CreateEventTonightProps {
  componentId: string;
  style?: StyleProp<ViewStyle>;
  group?: ProjetXGroup;
}

const CreateEventTonight: React.FC<CreateEventTonightProps> = ({
  componentId,
  style,
  group,
}) => {
  const dispatch = useAppDispatch();
  const friends = useSelector(selectMyFriends);
  const onOpenEvent = (event: ProjetXEvent) => {
    notifyNewEvent(
      event,
      friends.filter(friend =>
        [EventParticipation.notanswered, EventParticipation.maybe].includes(
          event.participations[friend.id],
        ),
      ),
    );
    dispatch(openEvent(event));
    Navigation.push(componentId, {
      component: {
        name: 'Event',
      },
    });
  };
  const createEvent = async () => {
    const title = translate('Un verre ce soir');
    const event: ProjetXEvent = new ProjetXEvent({
      type: EventType.party,
      dateType: EventDateType.fixed,
      date: {date: moment()},
      time: moment().set({hours: 20, minutes: 0}),
      title,
      id: slugifyEventId(title),
    });
    if (group && group.id) {
      event.groups = {[group.id]: true};
      for (const user of Object.keys(group.users)) {
        event.participations[user] = EventParticipation.notanswered;
      }
      event.participations[getMe().uid] = EventParticipation.going;
      const eventSaved = await saveEvent(event);
      await onOpenEvent(eventSaved);
    } else {
      dispatch(openEvent(event));
      Navigation.push(componentId, {
        component: {
          name: 'CreateEventWho',
          passProps: {
            onSave: async (eventSaved: ProjetXEvent) => {
              await Navigation.pop(componentId);
              await onOpenEvent(eventSaved);
            },
          },
        },
      });
    }
  };

  return (
    <Button
      style={style}
      variant="outlined"
      title={translate('Un verre ce soir')}
      onPress={createEvent}
    />
  );
};

export default CreateEventTonight;
