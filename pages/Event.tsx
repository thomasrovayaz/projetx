import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Title from '../components/Title';
import {ProjetXEvent} from '../api/Events';
import {eventTypeTitle} from '../utils/EventType';
import EventCTAs from '../components/EventCTAs';
import EventParticipants from '../components/EventParticipants';
import EventDescription from '../components/EventDescription';
import EventLocation from '../components/EventLocation';
import EventDate from '../components/EventDate';

interface EventScreenProps {
  event: ProjetXEvent;
  componentId: string;
}

const EventScreen: NavigationFunctionComponent<EventScreenProps> = ({
  componentId,
  event,
}) => {
  const [localEvent, setLocalEvent] = useState<ProjetXEvent>(event);
  if (!localEvent) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
      <View style={styles.header}>
        <Text style={styles.subtitle}>{eventTypeTitle(localEvent.type)}</Text>
        <Title style={styles.title}>{localEvent.title}</Title>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <EventDate
          event={localEvent}
          componentId={componentId}
          onUpdate={setLocalEvent}
        />
        <EventDescription
          event={localEvent}
          componentId={componentId}
          onUpdate={setLocalEvent}
        />
        <EventLocation
          event={localEvent}
          componentId={componentId}
          onUpdate={setLocalEvent}
        />
        <EventParticipants event={localEvent} withLabel />
      </ScrollView>
      <View style={styles.ctas}>
        <EventCTAs event={localEvent} componentId={componentId} />
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
    flex: 1,
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

EventScreen.options = props => {
  return {
    topBar: {
      title: {
        color: 'transparent',
        text: props.event.title,
      },
      borderColor: 'transparent',
      borderHeight: 0,
      elevation: 0,
    },
    bottomTabs: {
      visible: false,
    },
  };
};

export default EventScreen;
