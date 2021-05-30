import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Title from '../../../common/Title';
import EventCTAs from '../common/EventCTAs';
import EventParticipants from '../common/EventParticipants';
import EventDescription from '../common/EventDescription';
import EventLocation from '../common/EventLocation';
import EventDate from '../common/EventDate';
import {eventTypeTitle} from '../eventsUtils';
import {useSelector} from 'react-redux';
import {selectCurrentEvent} from '../eventsSlice';

interface EventScreenProps {
  componentId: string;
}

const EventScreen: NavigationFunctionComponent<EventScreenProps> = ({
  componentId,
}) => {
  const event = useSelector(selectCurrentEvent);
  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          color: 'transparent',
          text: event?.title,
        },
      },
    });
  }, [event]);
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
      <ScrollView contentContainerStyle={styles.content}>
        <EventDate event={event} componentId={componentId} />
        <EventDescription event={event} componentId={componentId} />
        <EventLocation event={event} componentId={componentId} />
        <EventParticipants event={event} withLabel />
      </ScrollView>
      <View style={styles.ctas}>
        <EventCTAs event={event} componentId={componentId} />
      </View>
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
  content: {
    padding: 20,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },
  ctas: {
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
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
