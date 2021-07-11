import {
  Image,
  RefreshControl,
  SectionList,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {ProjetXEvent} from '../eventsTypes';
import {getMyEvents} from '../eventsApi';
import EventItem, {EventCardVariant} from './EventItem';
import Title from '../../../common/Title';
import {translate} from '../../../app/locales';
import {getMe, getUsers} from '../../user/usersApi';
import Text from '../../../common/Text';
import UpcomingEvents from './UpcomingEvents';
import WaitingForAnswerEvents from './WaitingForAnswerEvents';
import {DARK_BLUE} from '../../../app/colors';
import Button from '../../../common/Button';
import {createEvent} from '../eventsSlice';
import {useAppDispatch} from '../../../app/redux';
import {useNavigation} from '@react-navigation/native';

interface EventsListProps {
  emptyText?: string;
  events: ProjetXEvent[];
  onOpenEvent(eventId: string): void;
  style?: StyleProp<ViewStyle>;
}

const EmptyEventsList: React.FC<{emptyText?: string}> = ({emptyText}) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  return (
    <View style={styles.emptyList}>
      <Image
        style={styles.emptyImage}
        source={require('../../../assets/alone.webp')}
      />
      <Text style={styles.emptyText}>
        {emptyText
          ? emptyText
          : translate(
              'Toujours rien par ici, mais tu peux toujours réanimer ton groupe de pote en créant un événement 😎',
            )}
      </Text>
      <Button
        style={styles.emptyButton}
        icon={'calendar'}
        title={translate('Créer un évènement')}
        variant={'outlined'}
        onPress={() => {
          dispatch(createEvent());
          navigation.navigate('CreateEventType');
        }}
      />
    </View>
  );
};

const EventsList: React.FC<EventsListProps> = ({
  onOpenEvent,
  events,
  emptyText,
  style,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [passedEvents, setPassedEvents] = useState<ProjetXEvent[]>([]);

  useEffect(() => {
    if (!events) {
      setPassedEvents([]);
      return;
    }
    setPassedEvents(events.filter(event => event.isFinished()));
  }, [events]);

  const fetchEvents = async () => {
    setRefreshing(true);
    await Promise.all([getMyEvents(), getUsers()]);
    setRefreshing(false);
  };
  const onRefresh = useCallback(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const renderItem = ({item}: {item: ProjetXEvent}) => (
    <View style={styles.item} key={item.id}>
      <EventItem
        event={item}
        variant={EventCardVariant.HORIZONTAL}
        onPress={() => onOpenEvent(item.id)}
      />
    </View>
  );

  if (!events || events.length <= 0) {
    return <EmptyEventsList emptyText={emptyText} />;
  }
  return (
    <SectionList
      ListHeaderComponent={() => (
        <View style={styles.listHeader}>
          <WaitingForAnswerEvents />
          <UpcomingEvents />
        </View>
      )}
      stickySectionHeadersEnabled={false}
      sections={[{title: translate('Évènements passés'), data: passedEvents}]}
      keyExtractor={item => item.id}
      contentContainerStyle={style}
      renderItem={renderItem}
      renderSectionHeader={({section: {title, data}}) =>
        data.length > 0 ? (
          <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
        ) : null
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  emptyList: {
    flex: 1,
    padding: 20,
    alignItems: 'flex-start',
  },
  emptyIcon: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'left',
    fontSize: 18,
    marginVertical: 40,
  },
  emptyImage: {
    width: '100%',
  },
  emptyButton: {},
  content: {
    flex: 1,
  },
  label: {
    paddingHorizontal: 20,
  },
  item: {
    paddingHorizontal: 20,
  },
  card: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  headerIcon: {
    marginRight: 5,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_BLUE,
  },
  listHeader: {},
});

export default EventsList;
