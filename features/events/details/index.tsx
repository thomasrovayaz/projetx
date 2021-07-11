import React, {useEffect, useState} from 'react';
import {Alert, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {eventTypeTitle} from '../eventsUtils';
import {useSelector} from 'react-redux';
import {editEvent, selectEvent} from '../eventsSlice';
import Tabs, {Tab} from '../../../common/Tabs';
import {translate} from '../../../app/locales';
import EventDetails from './EventDetails';
import Chat from '../../chat/Chat';
import {useAppDispatch, useAppSelector} from '../../../app/redux';
import {selectUnreadMessageCount} from '../../chat/chatsSlice';
import DetailHeader from '../../../common/DetailHeader';
import {EventParticipation} from '../eventsTypes';
import {NotificationParentType} from '../../../app/onesignal';
import EventPolls from './EventPolls';
import {selectUser} from '../../user/usersSlice';
import {cancelEvent, getEvent} from '../eventsApi';
import {useNavigation} from '@react-navigation/native';
import {BEIGE, DARK_BLUE, RED} from '../../../app/colors';
import {getUsers} from '../../user/usersApi';
enum EventTab {
  details = 'details',
  sondages = 'sondages',
  chat = 'chat',
}

interface EventScreenProps {
  route: {
    params: {
      eventId: string;
      chat?: boolean;
    };
  };
}
const EventScreen: React.FC<EventScreenProps> = ({route}) => {
  const navigation = useNavigation();
  const {chat, eventId} = route.params;
  const event = useSelector(selectEvent(eventId));
  const [tab, setTab] = useState<EventTab>(
    chat ? EventTab.chat : EventTab.details,
  );
  const unreadMessages = useAppSelector(selectUnreadMessageCount(event?.id));
  const author = useAppSelector(selectUser(event?.author));
  const dispatch = useAppDispatch();
  const tabs: Tab[] = [
    {id: EventTab.details, title: translate('Détails')},
    {id: EventTab.sondages, title: translate('Sondages')},
    {id: EventTab.chat, title: translate('Messages'), badge: unreadMessages},
  ];
  const edit = () => {
    dispatch(editEvent(event));
    navigation.navigate('CreateEventType');
  };
  const openParticipants = () => {
    navigation.navigate('EventParticipants', {eventId: event.id});
  };
  const cancel = () => {
    Alert.alert(translate("Annuler l'événement"), translate('Es-tu sûr?'), [
      {
        text: translate('Non'),
        style: 'cancel',
      },
      {text: translate('Oui'), onPress: () => cancelEvent(event)},
    ]);
  };

  useEffect(() => {
    getEvent(eventId);
    getUsers();
  }, [eventId, tab]);

  if (!event) {
    return null;
  }

  const renderAuthor = () => {
    if (!author) {
      return null;
    }
    return `${translate('par')} ${author.name}`;
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar barStyle={'dark-content'} backgroundColor={BEIGE} />
      <DetailHeader
        title={event.title}
        small={tab !== EventTab.details}
        subtitle={`${eventTypeTitle(event.type)} ${renderAuthor()}`}
        actions={[
          {
            icon: 'users',
            color: DARK_BLUE,
            onPress: openParticipants,
          },
          {icon: 'edit', color: DARK_BLUE, onPress: edit},
          {icon: 'trash', color: RED, onPress: cancel},
        ]}
      />
      <View style={styles.tabContainer}>
        <Tabs
          tabs={tabs}
          selectedTab={tab}
          onChangeTab={tabSelected => setTab(tabSelected as EventTab)}
        />
      </View>
      {tab === EventTab.details ? <EventDetails eventId={event.id} /> : null}
      {tab === EventTab.sondages ? <EventPolls eventId={event.id} /> : null}
      {tab === EventTab.chat ? (
        <Chat
          parent={{
            id: event.id,
            title: event.title,
            type: NotificationParentType.EVENT,
          }}
          members={Object.keys(event.participations).filter(
            userId => event.participations[userId] === EventParticipation.going,
          )}
        />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
  },
});

export default EventScreen;
