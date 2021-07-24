import React, {useCallback, useEffect, useState} from 'react';
import {
  RefreshControl,
  SafeAreaView,
  SectionList,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {EventParticipation} from './eventsTypes';
import {translate} from '../../app/locales';
import Icon from 'react-native-vector-icons/Feather';
import TextInput from '../../common/TextInput';
import Button from '../../common/Button';
import Text from '../../common/Text';
import {ProjetXUser} from '../user/usersTypes';
import {getMyId, getUsers} from '../user/usersApi';
import {getEvent} from './eventsApi';
import {filterWithFuse} from '../../app/fuse';
import {editEvent, selectEvent} from './eventsSlice';
import {useAppDispatch, useAppSelector} from '../../app/redux';
import User from '../../common/User';
import {useNavigation} from '@react-navigation/native';
import {BEIGE, DARK_BLUE} from '../../app/colors';
import {eventTypeInfos} from './eventsUtils';
import {useSelector} from 'react-redux';
import {selectMyFriends} from '../user/usersSlice';

export interface ProjetXEventParticipantsProps {
  route: {
    params: {
      eventId: string;
    };
  };
}

const ParticipantsModal: React.FC<ProjetXEventParticipantsProps> = ({
  route,
}) => {
  const {eventId} = route.params;
  const friends = useSelector(selectMyFriends);
  const navigation = useNavigation();
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
    dispatch(editEvent(event));
    navigation.navigate('CreateEventWho', {
      backOnSave: true,
    });
  };

  if (!event) {
    return null;
  }
  const eventInfos = eventTypeInfos(event.type);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={BEIGE} />
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
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <User
              avatarStyle={{backgroundColor: eventInfos?.bgColor}}
              avatarTextStyle={{color: eventInfos?.color}}
              friend={item}
            />
          )}
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
          {event.author === getMyId() ? (
            <Button
              title={translate('Modifier')}
              style={[styles.cta, styles.ctaLeft]}
              onPress={edit}
            />
          ) : null}
          <Button
            style={styles.cta}
            variant="outlined"
            title={translate('Fermer')}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    paddingBottom: 0,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 5,
    backgroundColor: BEIGE,
  },
  headerIcon: {
    marginRight: 5,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_BLUE,
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

export default ParticipantsModal;