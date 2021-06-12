import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {eventTypeTitle} from '../eventsUtils';
import {useSelector} from 'react-redux';
import {selectAmIParticipating, selectCurrentEvent} from '../eventsSlice';
import Tabs, {Tab} from '../../../common/Tabs';
import {translate} from '../../../app/locales';
import EventDetails from './EventDetails';
import Chat from '../../chat/Chat';
import {useAppSelector} from '../../../app/redux';
import {selectUnreadMessageCount} from '../../chat/chatsSlice';
import DetailHeader from '../../../common/DetailHeader';
import {EventParticipation} from '../eventsTypes';
import {NotificationParentType} from '../../../app/onesignal';
enum EventTab {
  details = 'details',
  sondages = 'sondages',
  chat = 'chat',
}

interface EventScreenProps {
  componentId: string;
  chat?: boolean;
}
const EventScreen: NavigationFunctionComponent<EventScreenProps> = ({
  componentId,
  chat,
}) => {
  const event = useSelector(selectCurrentEvent);
  const [tab, setTab] = useState<EventTab>(
    chat ? EventTab.chat : EventTab.details,
  );
  const unreadMessages = useAppSelector(selectUnreadMessageCount(event?.id));
  const participating = useAppSelector(selectAmIParticipating(event?.id));
  const tabs: Tab[] = [
    {id: EventTab.details, title: translate('Détails')},
    {id: EventTab.sondages, title: translate('Sondages')},
    {id: EventTab.chat, title: translate('Messages'), badge: unreadMessages},
  ];

  useEffect(() => {
    if (!event) {
      Navigation.pop(componentId);
      return;
    }
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          color: 'transparent',
          text: event.title,
        },
      },
    });
  }, [event, componentId]);

  if (!event) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
      <DetailHeader title={event.title} subtitle={eventTypeTitle(event.type)} />
      {participating ? (
        <View style={styles.tabContainer}>
          <Tabs
            tabs={tabs}
            selectedTab={tab}
            onChangeTab={tabSelected => setTab(tabSelected as EventTab)}
          />
        </View>
      ) : null}
      {tab === EventTab.details ? (
        <EventDetails event={event} componentId={componentId} />
      ) : null}
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
          componentId={componentId}
        />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
  },
});

EventScreen.options = {
  topBar: {
    title: {
      color: 'transparent',
      text: '',
    },
    borderColor: 'transparent',
    borderHeight: 0,
    elevation: 0,
  },
  bottomTabs: {
    visible: false,
  },
};

export default EventScreen;
