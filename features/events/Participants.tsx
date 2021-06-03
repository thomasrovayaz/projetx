import React, {useCallback, useEffect, useState} from 'react';
import {
  RefreshControl,
  SafeAreaView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {EventParticipation} from './eventsTypes';
import {translate} from '../../app/locales';
import Icon from 'react-native-vector-icons/Feather';
import Avatar from '../../common/Avatar';
import TextInput from '../../common/TextInput';
import Button from '../../common/Button';
import {ProjetXUser} from '../user/usersTypes';
import {getUsers} from '../user/usersApi';
import {getEvent} from './eventsApi';
import {filterWithFuse} from '../../app/fuse';
import {useSelector} from 'react-redux';
import {openEvent, selectEvent} from './eventsSlice';
import {useAppDispatch, useAppSelector} from '../../app/redux';

interface ProjetXEventParticipantsProps {
  eventId: string;
  friends: ProjetXUser[];
}

const ParticipantsModal: NavigationFunctionComponent<ProjetXEventParticipantsProps> =
  ({componentId, eventId, friends}) => {
    const dispatch = useAppDispatch();
    const event = useAppSelector(selectEvent(eventId));
    const [searchText, onChangeSearchText] = useState<string>('');
    const [refreshing, setRefreshing] = React.useState(false);
    const [participants, setParticipants] = useState<
      {
        title: string;
        icon: string;
        data: ProjetXUser[];
      }[]
    >([]);
    const onRefresh = useCallback(() => {
      const fetchUsers = async () => {
        setRefreshing(true);
        await Promise.all([getUsers(), getEvent(event.id)]);
        setRefreshing(false);
      };
      fetchUsers();
    }, [event]);

    useEffect(() => {
      if (!friends || !event) {
        return;
      }
      const friendsFilterByCategory = (
        category: EventParticipation,
      ): ProjetXUser[] => {
        return filterWithFuse(
          friends.filter(({id}) => event.participations[id] === category),
          ['name'],
          searchText,
        );
      };

      setParticipants([
        {
          title: translate('Participe'),
          icon: 'thumbs-up',
          data: friendsFilterByCategory(EventParticipation.going),
        },
        {
          title: translate('Peut-être'),
          icon: 'meh',
          data: friendsFilterByCategory(EventParticipation.maybe),
        },
        {
          title: translate('En attente'),
          icon: 'clock',
          data: friendsFilterByCategory(EventParticipation.notanswered),
        },
        {
          title: translate('Pas dispo'),
          icon: 'thumbs-down',
          data: friendsFilterByCategory(EventParticipation.notgoing),
        },
      ]);
    }, [friends, event, searchText]);

    const edit = () => {
      dispatch(openEvent(event));
      Navigation.push(componentId, {
        component: {
          name: 'CreateEventWho',
          passProps: {
            onSave: async () => Navigation.pop(componentId),
          },
        },
      });
    };

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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          <View style={styles.buttons}>
            <Button
              title={translate('Modifier')}
              style={[styles.cta, styles.ctaLeft]}
              onPress={edit}
            />
            <Button
              style={styles.cta}
              variant="outlined"
              title={translate('Fermer')}
              onPress={() => Navigation.dismissModal(componentId)}
            />
          </View>
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
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
  },
  cta: {
    flex: 1,
  },
  ctaLeft: {
    marginRight: 10,
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
