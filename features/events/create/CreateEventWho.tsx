import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import {EventParticipation} from '../eventsTypes';
import {saveEvent} from '../eventsApi';
import {getMe} from '../../user/usersApi';
import Checkbox from '../../../common/Checkbox';
import TextInput from '../../../common/TextInput';
import {ProjetXUser} from '../../user/usersTypes';
import {useSelector} from 'react-redux';
import {selectMyFriends} from '../../user/usersSlice';
import {selectCurrentEvent} from '../eventsSlice';

interface CreateEventWhoScreenProps {}

const CreateEventWhoScreen: NavigationFunctionComponent<CreateEventWhoScreenProps> =
  ({componentId}) => {
    const event = useSelector(selectCurrentEvent);
    const [searchText, onChangeSearchText] = useState<string>();
    const [selectedFriends, setSelectedFriends] = useState<string[]>(
      event?.participations ? Object.keys(event.participations) : [],
    );
    const friends = useSelector(selectMyFriends);

    if (!event) {
      return null;
    }

    const next = async () => {
      let participations = event.participations || {};
      for (const selectedFriend of selectedFriends) {
        if (!participations[selectedFriend]) {
          participations[selectedFriend] = EventParticipation.notanswered;
        }
      }
      const me = getMe();
      if (me && !participations[me.uid]) {
        participations[me.uid] = EventParticipation.going;
      }
      event.participations = participations;
      if (event.id) {
        await saveEvent(event);
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
            data={friends.filter(
              ({name}) =>
                !searchText ||
                (name && name.toUpperCase().includes(searchText.toUpperCase())),
            )}
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
          />
        </View>
        <View style={styles.buttonNext}>
          <Button title={translate('Suivant >')} onPress={next} />
        </View>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
