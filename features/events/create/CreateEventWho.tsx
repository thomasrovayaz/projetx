import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import {EventParticipation} from '../eventsTypes';
import {notifyNewEvent, saveEvent} from '../eventsApi';
import {getMyId} from '../../user/usersApi';
import {useSelector} from 'react-redux';
import {selectMyFriends} from '../../user/usersSlice';
import {selectCurrentEvent} from '../eventsSlice';
import _ from 'lodash';
import SelectableUsersList, {
  UsersSelection,
} from '../../../common/SelectableUsersList';
import {BEIGE} from '../../../app/colors';
import {useNavigation} from '@react-navigation/native';
import BackButton from '../../../common/BackButton';
import Title from '../../../common/Title';

interface CreateEventWhoScreenProps {
  route: {
    params: {
      backOnSave?: boolean;
    };
  };
}

const CreateEventWhoScreen: React.FC<CreateEventWhoScreenProps> = ({
  route: {
    params: {backOnSave},
  },
}) => {
  const navigation = useNavigation();
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
    const me = getMyId();
    participations[me] = EventParticipation.going;
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
            [EventParticipation.notanswered, EventParticipation.maybe].includes(
              event.participations[friend.id],
            ) && newParticipants.includes(friend.id),
        ),
      );
    } else {
      event.participations = participations;
    }
    if (backOnSave) {
      return navigation.goBack();
    }
    navigation.navigate('CreateEventWhat');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={BEIGE} />
      <View style={styles.header}>
        <BackButton />
      </View>
      <Title style={styles.title}>{translate('Qui veux-tu inviter ?')}</Title>
      <SelectableUsersList
        selection={selectedFriends}
        onChange={setSelectedFriends}
        withGroups
      />
      <View style={styles.buttonNext}>
        <Button
          title={translate(backOnSave ? 'Enregistrer' : 'Suivant >')}
          onPress={next}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  buttonNext: {
    padding: 20,
  },
});

export default CreateEventWhoScreen;
