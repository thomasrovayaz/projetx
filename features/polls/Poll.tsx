import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {DateValue} from '../events/eventsTypes';
import PollItem from './PollItem';
import {LocationValue} from '../events/create/components/LocationPicker';
import {PollState, ProjetXPoll} from './pollsTypes';
import Title from '../../common/Title';
import {translate} from '../../app/locales';

interface ProjetXPollProps {
  poll: ProjetXPoll;
  onChange?(answers: string[]): void;
  showResult?: boolean;
  myAnswers?: string[];
}

const Poll: React.FC<ProjetXPollProps> = ({
  poll,
  onChange,
  showResult,
  myAnswers,
}) => {
  const [answersCount, setAnswersCount] = useState<{
    [answerId: string]: number;
  }>({});

  useEffect(() => {
    if (poll) {
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
  }, [onChange, poll]);
  if (!poll) {
    return null;
  }
  const isMultiplePoll = poll.settings.multiple;

  const toggleAnswer = async (answerId: string) => {
    if (poll.state === PollState.FINISHED || !onChange) {
      return;
    }
    const isSelected = myAnswers?.includes(answerId);
    if (isMultiplePoll && myAnswers) {
      if (isSelected) {
        onChange(myAnswers.filter((answer: string) => answer !== answerId));
      } else {
        onChange([...myAnswers, answerId]);
      }
    } else {
      onChange([answerId]);
    }
  };

  const renderItem = ({
    item: {id, value},
  }: {
    item: {id: string; value: DateValue | LocationValue | undefined};
  }) => {
    if (!value) {
      return null;
    }
    return (
      <PollItem
        onPress={() => toggleAnswer(id)}
        count={answersCount[id]}
        totalVote={answersCount.total}
        value={value}
        type={poll.type}
        showResult={showResult}
        selected={myAnswers?.includes(id)}
      />
    );
  };

  return (
    <>
      <Title style={styles.title}>
        {showResult
          ? translate('Voici les résultats')
          : isMultiplePoll
          ? translate('Quel sont tes choix ?')
          : translate('Quel est ton choix ?')}
      </Title>
      <FlatList
        contentContainerStyle={styles.choicesList}
        data={poll.choices.filter((choice: any) => choice.value !== undefined)}
        renderItem={renderItem}
      />
    </>
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
  title: {
    marginBottom: 20,
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
  cta: {
    flex: 1,
  },
  ctaLeft: {
    marginRight: 10,
  },
});

export default Poll;
