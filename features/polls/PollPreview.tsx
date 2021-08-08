import React, {useEffect, useState} from 'react';
import {getMyId} from '../user/usersApi';
import {useAppSelector} from '../../app/redux';
import {selectPoll} from './pollsSlice';
import {getPoll, updatePollAnswers} from './pollsApi';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Poll from './Poll';
import {PollState} from './pollsTypes';
import Button from '../../common/Button';
import {translate} from '../../app/locales';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';
import {DARK_BLUE} from '../../app/colors';

const PollPreview: React.FC<{pollId: string; style?: StyleProp<ViewStyle>}> = ({
  pollId,
  style,
}) => {
  const navigation = useNavigation();
  const me = getMyId();
  const poll = useAppSelector(selectPoll(pollId));
  const initialAnswer = poll?.answers[me] || [];

  const [myAnswers, setMyAnswers] = useState<string[]>(initialAnswer);
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
      setHasNewAnswers(_.xor(newAnswers, initialAnswer).length !== 0);
    }
  };

  const edit = () => {
    navigation.navigate('EditPoll', {pollId});
  };
  const showResult = () => {
    navigation.navigate('PollResults', {pollId});
  };

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
            textStyle={styles.ctaText}
            style={[styles.cta, styles.ctaLeft]}
            title={translate('Valider')}
            onPress={() => validAnswers(myAnswers)}
          />
        ) : hasAnswered ? (
          <Button
            variant={'outlined'}
            textStyle={styles.ctaText}
            style={[styles.cta, styles.ctaLeft]}
            title={translate('Résultats')}
            onPress={showResult}
          />
        ) : (
          <View style={[styles.cta, styles.ctaLeft]} />
        )}
        {poll.author === getMyId() ? (
          <Button
            variant={'outlined'}
            textStyle={styles.ctaText}
            style={[styles.cta, styles.ctaRight]}
            title={translate('Modifer')}
            onPress={edit}
          />
        ) : (
          <View style={[styles.cta, styles.ctaRight]} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pollContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: DARK_BLUE,
    borderRadius: 15,
    padding: 15,
  },
  pollButtons: {
    marginTop: 10,
    flexDirection: 'row',
  },
  cta: {
    flex: 1,
    color: 'white',
    borderColor: 'white',
  },
  ctaText: {
    color: 'white',
  },
  ctaLeft: {
    marginRight: 5,
  },
  ctaRight: {
    marginLeft: 5,
  },
});

export default PollPreview;
