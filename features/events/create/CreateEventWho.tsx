import React, {useCallback, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import {EventParticipation, ProjetXEvent} from '../eventsTypes';
import {getEvent, notifyNewEvent, saveEvent} from '../eventsApi';
import {getMe, getUsers} from '../../user/usersApi';
import Checkbox from '../../../common/Checkbox';
import TextInput from '../../../common/TextInput';
import {ProjetXUser} from '../../user/usersTypes';
import {useSelector} from 'react-redux';
import {selectMyFriends} from '../../user/usersSlice';
import {selectCurrentEvent} from '../eventsSlice';
import {filterWithFuse} from '../../../app/fuse';
import _ from 'lodash';

interface CreateEventWhoScreenProps {
  onSave?(newEvent: ProjetXEvent): void;
}

const CreateEventWhoScreen: NavigationFunctionComponent<CreateEventWhoScreenProps> =
  ({componentId, onSave}) => {
    const event = useSelector(selectCurrentEvent);
    const [searchText, onChangeSearchText] = useState<string>('');
    const [selectedFriends, setSelectedFriends] = useState<string[]>(
      event?.participations ? Object.keys(event.participations) : [],
    );
    const friends = useSelector(selectMyFriends);
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = useCallback(() => {
      const fetchUsers = async () => {
        setRefreshing(true);
        await Promise.all([getUsers(), event && getEvent(event.id)]);
        setRefreshing(false);
      };
      fetchUsers();
    }, [event]);

    if (!event) {
      return null;
    }

    const next = async () => {
      let participations: {[userId: string]: EventParticipation} = {};
      for (const selectedFriend of selectedFriends) {
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
      if (event.id) {
        const newParticipants = _.difference(
          Object.keys(participations),
          Object.keys(event.participations),
        );
        event.participations = participations;
        await saveEvent({...event});
        notifyNewEvent(event, friends, newParticipants);
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
        <View style={styles.searchInput}>
          <TextInput
            value={searchText}
            onChangeText={onChangeSearchText}
            placeholder={translate('Rechercher...')}
          />
        </View>
        <View style={styles.content}>
          <FlatList
            contentContainerStyle={styles.usersList}
            data={filterWithFuse(friends, ['name'], searchText)}
            renderItem={({item}: {item: ProjetXUser}) => {
              return (
                <Checkbox
                  key={item.id}
                  label={item.name}
                  selected={selectedFriends.some(id => id === item.id)}
                  onSelect={selected => {
                    if (selected) {
                      setSelectedFriends([...selectedFriends, item.id]);
                    } else {
                      setSelectedFriends(
                        selectedFriends.filter(id => id !== item.id),
                      );
                    }
                  }}
                />
              );
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
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
  searchInput: {
    paddingTop: 20,
    paddingBottom: 0,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  usersList: {paddingTop: 20},
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
