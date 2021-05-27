import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../components/Button';
import Title from '../components/Title';
import {ProjetXEvent} from '../api/Events';
import {eventTypeTitle} from '../utils/EventType';
import EventCTAs from '../components/EventCTAs';
import {translate} from '../locales';
import EventParticipants from '../components/EventParticipants';
import Label from '../components/Label';

interface EventScreenProps {
  event: ProjetXEvent;
  componentId: string;
}

const EventScreen: NavigationFunctionComponent<EventScreenProps> = ({
  componentId,
  event,
}) => {
  if (!event) {
    return null;
  }

  const showModal = (id: string) => {
    return Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: id,
            },
          },
        ],
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.header}>
        <Text style={styles.subtitle}>{eventTypeTitle(event.type)}</Text>
        <Title style={styles.title}>{event.title}</Title>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {event.description && (
          <>
            <Label>{translate('Description')}</Label>
            <Text style={styles.value}>{event.description}</Text>
          </>
        )}
        <EventParticipants event={event} withLabel />
        <Button title="Register" onPress={() => showModal('Register')} />
        <Button title="Show poll" onPress={() => showModal('Poll')} />
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
  value: {
    fontFamily: 'Inter',
    fontSize: 14,
    marginBottom: 20,
  },
  ctas: {
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: 130,
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
