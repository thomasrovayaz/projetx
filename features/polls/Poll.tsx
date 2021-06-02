import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {useAppSelector} from '../../app/redux';
import {selectPoll} from './pollsSlice';
import {getPoll, updatePollAnswers} from './pollsApi';
import {DateValue} from '../events/eventsTypes';
import {getMe} from '../user/usersApi';
import Button from '../../common/Button';
import {translate} from '../../app/locales';
import PollItem from './PollItem';
import {LocationValue} from '../events/create/components/LocationPicker';
import {PollState} from './pollsTypes';

interface ProjetXPollProps {
  pollId: string;
}

const PollModal: NavigationFunctionComponent<ProjetXPollProps> = ({
  pollId,
  componentId,
}) => {
  const poll = useAppSelector(selectPoll(pollId));
  const me = getMe().uid;
  const [answers, setAnswers] = useState(poll?.answers[me] || []);
  const [answersCount, setAnswersCount] = useState<{
    [answerId: string]: number;
  }>({});

  useEffect(() => {
    getPoll(pollId);
  }, [pollId]);
  useEffect(() => {
    if (poll) {
      setAnswers(poll.answers[me] || []);
      setAnswersCount(
        Object.values<string[]>(poll.answers).reduce<{
          [answerId: string]: number;
        }>(
          (accumulator, userAnswers) => {
            for (const answerId of userAnswers) {
              if (!accumulator[answerId]) {
                accumulator[answerId] = 0;
              }
              accumulator[answerId]++;
              accumulator.total++;
            }
            return accumulator;
          },
          {total: 0},
        ),
      );
    }
  }, [poll, me]);
  if (!poll) {
    return null;
  }
  const isMultiplePoll = poll.settings.multiple;
  const hasAnswered = answers.length > 0;

  const toggleAnswer = (answerId: string) => {
    if (poll.state === PollState.FINISHED) {
      return;
    }
    const isSelected = answers.includes(answerId);
    if (isMultiplePoll) {
      if (isSelected) {
        setAnswers(answers.filter((answer: string) => answer !== answerId));
      } else {
        setAnswers([...answers, answerId]);
      }
    } else {
      validAnswers([answerId]);
      setAnswers([answerId]);
    }
  };
  const validAnswers = (newAnswers: string[]) =>
    updatePollAnswers(poll, newAnswers);

  const renderItem = ({
    item: {id, value},
  }: {
    item: {id: string; value: DateValue | LocationValue};
  }) => {
    return (
      <PollItem
        onPress={() => toggleAnswer(id)}
        count={answersCount[id]}
        totalVote={answersCount.total}
        value={value}
        type={poll.type}
        showResult={poll.state === PollState.FINISHED || hasAnswered}
        selected={answers.includes(id)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
      <View style={styles.content}>
        <FlatList
          contentContainerStyle={styles.choicesList}
          data={poll.choices.filter((choice: any) => Boolean(choice.value))}
          renderItem={renderItem}
        />
        <View style={styles.buttons}>
          {isMultiplePoll ? (
            <Button
              title={translate('Valider')}
              onPress={() => validAnswers(answers)}
            />
          ) : null}
          <Button
            variant="outlined"
            title={translate('Fermer')}
            onPress={() => Navigation.dismissModal(componentId)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  choicesList: {},
  itemContainer: {
    width: '100%',
    height: 50,
    borderRadius: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(71,59,120,0.05)',
    borderColor: '#473B78',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  itemContainerSelected: {
    backgroundColor: '#473B78',
  },
  itemIcon: {
    color: '#473B78',
    marginRight: 5,
  },
  item: {
    color: '#473B78',
    fontWeight: '700',
  },
  itemSelected: {
    color: 'white',
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
  },
  closeButton: {},
});

PollModal.options = {
  topBar: {
    title: {
      text: 'Poll',
    },
  },
};

export default PollModal;
