import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import React, {useEffect, useCallback} from 'react';
import {ProjetXEvent} from '../eventsTypes';
import {getMyEvents} from '../eventsApi';
import EventItem from './EventItem';
import Title from '../../../common/Title';
import {translate} from '../../../app/locales';
import {getMe} from '../../user/usersApi';
import {useSelector} from 'react-redux';
import {closeEvent, selectMyEvents} from '../eventsSlice';
import {Navigation} from 'react-native-navigation';
import {useAppDispatch} from '../../../app/redux';

interface EventsListProps {
  componentId: string;
  onOpenEvent(event: ProjetXEvent): void;
}

const EmptyEventsList: React.FC = () => {
  return (
    <View style={styles.emptyList}>
      <Title style={styles.emptyText}>
        {translate(`Salut ${getMe()?.displayName} 👋\n`)}
      </Title>
      <Title style={styles.emptyText}>
        {translate('Tu peux créer et inviter tes amis à ton premier événement')}
      </Title>
    </View>
  );
};

const EventsList: React.FC<EventsListProps> = ({componentId, onOpenEvent}) => {
  const dispatch = useAppDispatch();
  const events: ProjetXEvent[] = useSelector(selectMyEvents);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchEvents = async () => {
    setRefreshing(true);
    await getMyEvents();
    setRefreshing(false);
  };
  const onRefresh = useCallback(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const screenEventListener =
      Navigation.events().registerComponentDidAppearListener(event => {
        if (event.componentId === componentId) {
          dispatch(closeEvent());
        }
      });
    fetchEvents();
    return () => {
      screenEventListener.remove();
    };
  }, []);

  const renderItem = ({item}: {item: ProjetXEvent}) => (
    <View style={styles.item} key={item.id}>
      <EventItem
        event={item}
        componentId={componentId}
        onPress={() => onOpenEvent(item)}
      />
    </View>
  );

  return (
    <FlatList
      data={events}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={(!events || events.length <= 0) && styles.content}
      ListEmptyComponent={EmptyEventsList}
    />
  );
};

const styles = StyleSheet.create({
  emptyList: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  emptyIcon: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'left',
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  item: {
    padding: 20,
  },
});

export default EventsList;
