import React, {useEffect, useState} from 'react';
import {getMyId} from '../user/usersApi';
import {useAppSelector} from '../../app/redux';
import {selectPoll} from './pollsSlice';
import {getPoll, updatePollAnswers} from './pollsApi';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Poll from './Poll';
import {PollState} from './pollsTypes';
import Button from '../../common/Button';
import {translate} from '../../app/locales';
import {EventParticipation} from '../events/eventsTypes';
import {useNavigation} from '@react-navigation/native';

const PollPreview: React.FC<{pollId: string; style?: ViewStyle}> = ({
  pollId,
  style,
}) => {
  const navigation = useNavigation();
  const me = getMyId();
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

  const edit = () => {};

  return (
    <View style={[styles.pollContainer, style]}>
      <Poll
        poll={poll}
        myAnswers={myAnswers}
        onChange={onChange}
        showResult={poll.state === PollState.FINISHED || hasAnswered}
      />
      <View style={styles.pollButtons}>
        {isMultiplePoll && hasNewAnswers ? (
          <Button
            variant={'outlined'}
            style={[styles.cta, styles.ctaLeft]}
            title={translate('Valider')}
            onPress={() => validAnswers(myAnswers)}
          />
        ) : (
          <View style={styles.cta} />
        )}
        {poll.author === getMyId() ? (
          <Button
            variant={'outlined'}
            style={[styles.cta, styles.ctaRight]}
            title={translate('Modifer')}
            onPress={edit}
          />
        ) : (
          <View style={styles.cta} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pollContainer: {
    flex: 1,
    width: '100%',
  },
  pollButtons: {
    marginTop: 10,
    flexDirection: 'row',
  },
  cta: {
    flex: 1,
  },
  ctaLeft: {
    marginRight: 5,
  },
  ctaRight: {
    marginLeft: 5,
  },
});

export default PollPreview;