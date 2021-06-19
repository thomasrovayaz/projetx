import React, {useCallback} from 'react';
import {getEvent} from '../eventsApi';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import {useAppSelector} from '../../../app/redux';
import {selectPolls} from '../../polls/pollsSlice';
import {Navigation} from 'react-native-navigation';
import Title from '../../../common/Title';
import {ProjetXPoll} from '../../polls/pollsTypes';
import PollPreview from '../../polls/PollPreview';

interface EventDetailsProps {
  eventId: string;
  componentId: string;
}
const EmptyPollsList: React.FC = () => {
  return (
    <View style={styles.emptyList}>
      <Title style={styles.emptyText}>
        {`${translate('Pas encore de sondage')}\n\n${translate(
          'Tu peux en créer un simplement',
        )}`}
      </Title>
    </View>
  );
};

const EventPolls: React.FC<EventDetailsProps> = ({eventId, componentId}) => {
  const polls = useAppSelector(selectPolls(eventId));
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = useCallback(() => {
    const fetchEvent = async () => {
      setRefreshing(true);
      await getEvent(eventId);
      setRefreshing(false);
    };
    fetchEvent();
  }, [eventId]);

  const renderItem = ({item}: {item: ProjetXPoll}) => {
    return (
      <View style={styles.pollContainer}>
        <Title style={styles.pollTitle}>{item.title}</Title>
        <PollPreview pollId={item.id} />
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={polls}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={(!polls || polls.length <= 0) && styles.content}
        ListEmptyComponent={<EmptyPollsList />}
      />
      <View style={styles.buttonCreate}>
        <Button
          title={translate('Créer un sondage')}
          onPress={() => {
            Navigation.showModal({
              stack: {
                children: [
                  {
                    component: {
                      name: 'CreatePollType',
                      passProps: {
                        parentId: eventId,
                      },
                    },
                  },
                ],
              },
            });
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  buttonCreate: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  emptyList: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  emptyText: {
    textAlign: 'left',
    fontSize: 18,
  },
  pollContainer: {
    padding: 20,
  },
  pollTitle: {
    textAlign: 'left',
  },
});

export default EventPolls;
