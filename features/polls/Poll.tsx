import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {DateValue} from '../events/eventsTypes';
import PollItem from './PollItem';
import {LocationValue} from '../events/create/components/LocationPicker';
import {PollState, ProjetXPoll} from './pollsTypes';

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
    item: {id: string; value: DateValue | LocationValue | string | undefined};
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
        isMultipleChoices={poll.settings.multiple}
      />
    );
  };

  return (
    <FlatList
      data={poll.choices.filter((choice: any) => choice.value !== undefined)}
      renderItem={renderItem}
    />
  );
};

export default Poll;
