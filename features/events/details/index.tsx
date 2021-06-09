import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View, Text} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Title from '../../../common/Title';
import {eventTypeTitle} from '../eventsUtils';
import {useSelector} from 'react-redux';
import {selectAmIParticipating, selectCurrentEvent} from '../eventsSlice';
import Tabs, {Tab} from '../../../common/Tabs';
import {translate} from '../../../app/locales';
import EventDetails from './EventDetails';
import EventChat from '../../chat/EventChat';
import {useAppSelector} from '../../../app/redux';
import {selectUnreadMessageCount} from '../../chat/chatsSlice';
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
  const unreadMessages = useAppSelector(selectUnreadMessageCount(event.id));
  const participating = useAppSelector(selectAmIParticipating(event.id));
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
      <View style={styles.header}>
        <Text style={styles.subtitle}>{eventTypeTitle(event.type)}</Text>
        <Title style={styles.title}>{event.title}</Title>
      </View>
      {participating ? (
        <View style={styles.tabContainer}>
          <Tabs
            tabs={tabs}
            selectedTab={tab}
            onChangeTab={tabSelected => setTab(tabSelected as EventTab)}
          />
        </View>
      ) : null}
      {tab === EventTab.details && (
        <EventDetails event={event} componentId={componentId} />
      )}
      {tab === EventTab.chat && (
        <EventChat event={event} componentId={componentId} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#473B78',
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: 'flex-start',
    borderBottomRightRadius: 20,
  },
  subtitle: {
    color: 'white',
    fontFamily: 'Inter',
    fontSize: 14,
  },
  title: {
    color: 'white',
    textAlign: 'left',
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
