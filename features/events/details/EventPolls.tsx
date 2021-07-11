import React, {useCallback} from 'react';
import {getEvent} from '../eventsApi';
import {FlatList, Image, RefreshControl, StyleSheet, View} from 'react-native';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import {useAppSelector} from '../../../app/redux';
import {selectPolls} from '../../polls/pollsSlice';
import Title from '../../../common/Title';
import Text from '../../../common/Text';
import {ProjetXPoll} from '../../polls/pollsTypes';
import PollPreview from '../../polls/PollPreview';
import {selectEvent} from '../eventsSlice';
import {EventParticipation} from '../eventsTypes';
import {useNavigation} from '@react-navigation/native';

interface EventDetailsProps {
  eventId: string;
}
const EmptyPollsList: React.FC = () => {
  return (
    <View style={styles.emptyList}>
      <Image
        style={styles.emptyGif}
        source={require('../../../assets/empty.gif')}
      />
      <Title style={styles.emptyText}>
        {translate('Pas encore de sondage 🤷‍♂️')}
      </Title>
      <Text>
        {translate(
          'Tu peux faire un sondage pour choisir une date, un lieu ou lancer un débat sur la chocolatine 💣',
        )}
      </Text>
    </View>
  );
};

const EventPolls: React.FC<EventDetailsProps> = ({eventId}) => {
  const navigation = useNavigation();
  const polls = useAppSelector(selectPolls(eventId));
  const event = useAppSelector(selectEvent(eventId));
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
          variant={'outlined'}
          title={translate('Créer un sondage')}
          onPress={() => {
            navigation.navigate('CreatePoll', {
              parentId: eventId,
              parentTitle: event.title,
              usersToNotify: Object.keys(event.participations).filter(
                userId =>
                  event.participations[userId] === EventParticipation.going,
              ),
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
    alignItems: 'flex-start',
  },
  emptyGif: {
    width: '100%',
    maxHeight: '50%',
    marginBottom: 20,
  },
  emptyText: {
    marginBottom: 10,
  },
  pollContainer: {
    padding: 20,
  },
  pollTitle: {
    textAlign: 'left',
  },
});

export default EventPolls;
