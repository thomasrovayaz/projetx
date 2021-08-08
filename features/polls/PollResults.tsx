import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  RefreshControl,
  SafeAreaView,
  SectionList,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {translate} from '../../app/locales';
import TextInput from '../../common/TextInput';
import Button from '../../common/Button';
import Text from '../../common/Text';
import {ProjetXUser} from '../user/usersTypes';
import {getUsers} from '../user/usersApi';
import {filterWithFuse} from '../../app/fuse';
import {useAppSelector} from '../../app/redux';
import User from '../../common/User';
import {useNavigation} from '@react-navigation/native';
import {BEIGE, DARK_BLUE} from '../../app/colors';
import {useSelector} from 'react-redux';
import {selectMyFriends} from '../user/usersSlice';
import {selectPoll} from './pollsSlice';
import {getPoll} from './pollsApi';
import {PollType, ProjetXPoll} from './pollsTypes';
import {DateValue} from '../events/eventsTypes';
import {dateFormat} from '../../common/Date';
import {LocationValue} from '../events/create/components/LocationPicker';
import Title from '../../common/Title';

export interface ProjetXEventParticipantsProps {
  route: {
    params: {
      pollId: string;
    };
  };
}

const EmptyResultsList: React.FC = () => {
  return (
    <View style={styles.emptyList}>
      <Image
        style={styles.emptyImage}
        source={require('../../assets/emptypoll.gif')}
      />
      <Text style={styles.emptyText}>
        {translate('Pas encore de réponse, reviens stalker plus tard 👀')}
      </Text>
    </View>
  );
};

const PollResultsModal: React.FC<ProjetXEventParticipantsProps> = ({route}) => {
  const {pollId} = route.params;
  const friends = useSelector(selectMyFriends);
  const navigation = useNavigation();
  const poll: ProjetXPoll | undefined = useAppSelector(selectPoll(pollId));
  const [searchText, onChangeSearchText] = useState<string>('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [results, setResults] = useState<
    {
      title: string;
      data: ProjetXUser[];
    }[]
  >([]);
  const onRefresh = useCallback(() => {
    const fetchUsers = async () => {
      setRefreshing(true);
      await Promise.all([getUsers(), getPoll(pollId)]);
      setRefreshing(false);
    };
    fetchUsers();
  }, [pollId]);

  useEffect(() => {
    if (!friends || !poll) {
      return;
    }
    const friendsFilterByAnswer = (answerId: string): ProjetXUser[] => {
      return filterWithFuse(
        friends.filter(
          ({id}) => poll.answers[id] && poll.answers[id].includes(answerId),
        ),
        ['name'],
        searchText,
      );
    };

    const formatValue = (
      value: DateValue | LocationValue | string | undefined,
    ): string => {
      if (!value) {
        return '';
      }
      if (poll.type === PollType.DATE) {
        const date = value as DateValue;
        if (date.date) {
          return date.date.format(dateFormat);
        }
        if (date.startDate) {
          return date.endDate
            ? `${date.startDate.format(dateFormat)} ${translate(
                'au',
              )} ${date.endDate.format(dateFormat)}`
            : date.startDate.format(dateFormat);
        }
        return '';
      } else if (poll.type === PollType.LOCATION) {
        const location = value as LocationValue;
        return location.formatted_address;
      }
      return value as string;
    };

    setResults(
      poll.choices
        .map(({id, value}) => ({
          title: formatValue(value),
          data: friendsFilterByAnswer(id),
        }))
        .filter(({data}) => data && data.length > 0),
    );
  }, [friends, poll, searchText]);

  if (!poll) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.content}>
        <Title style={styles.title}>{poll.title}</Title>
        {results && results.length > 0 ? (
          <Text style={styles.stalker}>
            {translate('Je te vois stalker 👀')}
          </Text>
        ) : null}
        <View style={styles.searchInput}>
          <TextInput
            value={searchText}
            onChangeText={onChangeSearchText}
            placeholder={translate('Rechercher...')}
          />
        </View>
        <SectionList
          sections={results}
          ListEmptyComponent={EmptyResultsList}
          keyExtractor={item => item.id}
          renderItem={({item}) => <User friend={item} />}
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
        <View style={styles.buttons}>
          <Button
            style={styles.cta}
            variant="outlined"
            title={translate('Fermer')}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {},
  stalker: {},
  searchInput: {
    marginTop: 20,
    paddingBottom: 0,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 5,
    backgroundColor: BEIGE,
  },
  headerIcon: {
    marginRight: 5,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_BLUE,
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
  },
  cta: {
    flex: 1,
  },
  emptyList: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'flex-start',
  },
  emptyIcon: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'left',
    fontSize: 18,
    marginVertical: 30,
  },
  emptyImage: {
    width: '100%',
    height: 200,
  },
});

export default PollResultsModal;
