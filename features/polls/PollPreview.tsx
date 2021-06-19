import React, {useEffect, useState} from 'react';
import {ProjetXMessage} from '../chat/chatsTypes';
import {getMe} from '../user/usersApi';
import {useAppSelector} from '../../app/redux';
import {selectPoll} from './pollsSlice';
import {getPoll, updatePollAnswers} from './pollsApi';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Poll from './Poll';
import {PollState} from './pollsTypes';
import Button from '../../common/Button';
import {translate} from '../../app/locales';

const PollPreview: React.FC<{pollId: string; style?: ViewStyle}> = ({
  pollId,
  style,
}) => {
  const me = getMe().uid;
  const poll = useAppSelector(selectPoll(pollId));

  const [myAnswers, setMyAnswers] = useState<string[]>(poll?.answers[me]);
  const [hasAnswered, setHasAnswered] = useState(myAnswers?.length > 0);
  const [hasNewAnswers, setHasNewAnswers] = useState(false);

  useEffect(() => {
    if (pollId) {
      getPoll(pollId);
    }
  }, [pollId]);

  if (!poll) {
    return null;
  }

  const isMultiplePoll = poll.settings.multiple;

  const validAnswers = async (newAnswers: string[]) => {
    await updatePollAnswers(poll, newAnswers);
    setHasAnswered(true);
    setHasNewAnswers(false);
  };

  const onChange = async (newAnswers: []) => {
    setMyAnswers(newAnswers);
    if (!isMultiplePoll) {
      await validAnswers(newAnswers);
    } else {
      setHasNewAnswers(true);
    }
  };

  return (
    <View style={[styles.pollContainer, style]}>
      <Poll
        poll={poll}
        myAnswers={myAnswers}
        onChange={onChange}
        showResult={poll.state === PollState.FINISHED || hasAnswered}
      />
      {isMultiplePoll && hasNewAnswers ? (
        <Button
          style={styles.pollButton}
          title={translate('Valider')}
          onPress={() => validAnswers(myAnswers)}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  pollContainer: {
    flex: 1,
    width: '100%',
  },
  pollButton: {
    marginTop: 10,
  },
});

export default PollPreview;
