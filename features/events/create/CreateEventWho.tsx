import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import {EventParticipation, ProjetXEvent} from '../eventsTypes';
import {notifyNewEvent, saveEvent} from '../eventsApi';
import {getMe} from '../../user/usersApi';
import {useSelector} from 'react-redux';
import {selectMyFriends} from '../../user/usersSlice';
import {selectCurrentEvent} from '../eventsSlice';
import _ from 'lodash';
import SelectableUsersList, {
  UsersSelection,
} from '../../../common/SelectableUsersList';

interface CreateEventWhoScreenProps {
  onSave?(newEvent: ProjetXEvent): void;
}

const CreateEventWhoScreen: NavigationFunctionComponent<CreateEventWhoScreenProps> =
  ({componentId, onSave}) => {
    const event = useSelector(selectCurrentEvent);
    const [selectedFriends, setSelectedFriends] = useState<UsersSelection>({
      usersSelected: event?.participations
        ? Object.keys(event.participations)
        : [],
      groupsSelected: event?.groups ? Object.keys(event.groups) : [],
    });
    const friends = useSelector(selectMyFriends);

    if (!event) {
      return null;
    }

    const next = async () => {
      let participations: {[userId: string]: EventParticipation} = {};
      for (const selectedFriend of selectedFriends.usersSelected) {
        if (event.participations[selectedFriend] === undefined) {
          participations[selectedFriend] = EventParticipation.notanswered;
        } else {
          participations[selectedFriend] = event.participations[selectedFriend];
        }
      }
      const me = getMe();
      if (participations[me.uid] === undefined) {
        participations[me.uid] = EventParticipation.going;
      }
      event.groups = selectedFriends.groupsSelected.reduce<
        Record<string, boolean>
      >((groups, groupId) => {
        groups[groupId] = true;
        return groups;
      }, {});
      if (event.id) {
        const newParticipants = _.difference(
          Object.keys(participations),
          Object.keys(event.participations),
        );
        event.participations = participations;
        await saveEvent({...event});
        notifyNewEvent(
          event,
          friends.filter(
            friend =>
              [
                EventParticipation.notanswered,
                EventParticipation.maybe,
              ].includes(event.participations[friend.id]) &&
              newParticipants.includes(friend.id),
          ),
        );
      } else {
        event.participations = participations;
      }
      if (onSave) {
        return onSave(event);
      }
      await Navigation.push(componentId, {
        component: {
          name: 'CreateEventWhat',
        },
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
        <SelectableUsersList
          selection={selectedFriends}
          onChange={setSelectedFriends}
          withGroups
        />
        <View style={styles.buttonNext}>
          <Button
            title={translate(onSave ? 'Enregistrer' : 'Suivant >')}
            onPress={next}
          />
        </View>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonNext: {
    padding: 20,
  },
});

CreateEventWhoScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: translate('Qui ?'),
    },
  },
  bottomTabs: {
    visible: false,
  },
};

export default CreateEventWhoScreen;
