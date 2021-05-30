import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {ProjetXEvent} from './eventsTypes';
import {translate} from '../../app/locales';
import Icon from 'react-native-vector-icons/Feather';
import Avatar from '../../common/Avatar';
import TextInput from '../../common/TextInput';
import Button from '../../common/Button';
import {ProjetXUser} from '../user/usersTypes';

interface ProjetXEventParticipantsProps {
  event: ProjetXEvent;
  friends: ProjetXUser[];
}

const ParticipantsModal: NavigationFunctionComponent<ProjetXEventParticipantsProps> =
  ({componentId, event, friends}) => {
    const [searchText, onChangeSearchText] = useState<string>();
    const [participants, setParticipants] = useState<
      {
        title: string;
        icon: string;
        data: ProjetXUser[];
      }[]
    >([]);

    useEffect(() => {
      const friendIsSearched = (name: string) => {
        return (
          !searchText ||
          (name && name.toUpperCase().includes(searchText.toUpperCase()))
        );
      };
      const friendsFilterByCategory = (category: string): ProjetXUser[] => {
        return friends.filter(
          ({id, name}) =>
            event.participations[id] === category && friendIsSearched(name),
        );
      };

      setParticipants([
        {
          title: translate('Participe'),
          icon: 'thumbs-up',
          data: friendsFilterByCategory('going'),
        },
        {
          title: translate('Peut-être'),
          icon: 'meh',
          data: friendsFilterByCategory('maybe'),
        },
        {
          title: translate('En attente'),
          icon: 'clock',
          data: friendsFilterByCategory('notanswered'),
        },
        {
          title: translate('Pas dispo'),
          icon: 'thumbs-down',
          data: friendsFilterByCategory('notgoing'),
        },
      ]);
    }, [friends, event, searchText]);

    const Item = ({friend}: {friend: ProjetXUser}) => (
      <View style={styles.item}>
        <Avatar key={friend.id} friend={friend} />
        <Text style={styles.title}>{friend.name}</Text>
      </View>
    );

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
        <View style={styles.content}>
          <View style={styles.searchInput}>
            <TextInput
              value={searchText}
              onChangeText={onChangeSearchText}
              placeholder={translate('Rechercher...')}
            />
          </View>
          <SectionList
            sections={participants}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({item}) => <Item friend={item} />}
            renderSectionHeader={({section: {title, icon, data}}) =>
              data.length > 0 ? (
                <View style={styles.header}>
                  <Icon style={styles.headerIcon} name={icon} size={24} />
                  <Text style={styles.headerText}>{title}</Text>
                </View>
              ) : null
            }
          />
          <Button
            variant="outlined"
            title={translate('Fermer')}
            onPress={() => Navigation.dismissModal(componentId)}
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
  content: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    paddingBottom: 0,
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    paddingVertical: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 5,
    backgroundColor: 'white',
  },
  headerIcon: {
    marginRight: 5,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 5,
  },
});

ParticipantsModal.options = {
  topBar: {
    title: {
      text: 'Participants',
    },
  },
};

export default ParticipantsModal;
