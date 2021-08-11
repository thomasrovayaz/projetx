import React, {useEffect, useState} from 'react';
import {getMyId} from '../user/usersApi';
import {useAppSelector} from '../../app/redux';
import {selectPoll} from './pollsSlice';
import {getPoll, updatePollAnswers} from './pollsApi';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Poll from './Poll';
import {PollState} from './pollsTypes';
import Button from '../../common/Button';
import Text from '../../common/Text';
import {translate} from '../../app/locales';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';
import {DARK_BLUE} from '../../app/colors';
import Icon from 'react-native-vector-icons/Feather';

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
  useEffect(() => {
    setHasAnswered(myAnswers?.length > 0);
  }, [myAnswers]);

  if (!poll) {
    return null;
  }

  const isMultiplePoll = poll.settings.multiple;
  const pollEnded = poll.state === PollState.FINISHED;

  const validAnswers = async (newAnswers: string[]) => {
    await updatePollAnswers(poll, newAnswers);
    setHasAnswered(true);
    setHasNewAnswers(false);
  };

  const onChange = async (newAnswers: []) => {
    if (pollEnded) {
      return;
    }
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
    <View
      style={[
        styles.pollContainer,
        pollEnded ? styles.pollEndedContainer : {},
        style,
      ]}>
      <Poll
        poll={poll}
        myAnswers={myAnswers}
        onChange={onChange}
        showResult={pollEnded || hasAnswered}
      />
      {pollEnded ? (
        <View style={styles.pollEndedInfoContainer}>
          <Icon name={'info'} size={15} style={styles.pollEndedInfoIcon} />
          <Text style={styles.pollEndedInfo}>
            {translate('Le sondage est terminé')}
          </Text>
        </View>
      ) : null}
      <View style={styles.pollButtons}>
        {isMultiplePoll && hasNewAnswers ? (
          <Button
            variant={'outlined'}
            textStyle={pollEnded ? styles.ctaPollEndedText : styles.ctaText}
            style={[
              pollEnded ? styles.ctaPollEnded : styles.cta,
              styles.ctaLeft,
            ]}
            title={translate('Valider')}
            onPress={() => validAnswers(myAnswers)}
          />
        ) : pollEnded || hasAnswered ? (
          <Button
            variant={'outlined'}
            textStyle={pollEnded ? styles.ctaPollEndedText : styles.ctaText}
            style={[
              pollEnded ? styles.ctaPollEnded : styles.cta,
              styles.ctaLeft,
            ]}
            title={translate('Résultats')}
            onPress={showResult}
          />
        ) : (
          <View
            style={[
              pollEnded ? styles.ctaPollEnded : styles.cta,
              styles.ctaLeft,
            ]}
          />
        )}
        {poll.author === getMyId() ? (
          <Button
            variant={'outlined'}
            textStyle={pollEnded ? styles.ctaPollEndedText : styles.ctaText}
            style={[
              pollEnded ? styles.ctaPollEnded : styles.cta,
              styles.ctaRight,
            ]}
            title={translate('Modifer')}
            onPress={edit}
          />
        ) : (
          <View
            style={[
              pollEnded ? styles.ctaPollEnded : styles.cta,
              styles.ctaRight,
            ]}
          />
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
  pollEndedContainer: {
    padding: 0,
    backgroundColor: 'transparent',
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
  ctaPollEnded: {
    flex: 1,
  },
  ctaPollEndedText: {},
  ctaLeft: {
    marginRight: 5,
  },
  ctaRight: {
    marginLeft: 5,
  },
  pollEndedInfoContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pollEndedInfoIcon: {marginRight: 5},
  pollEndedInfo: {},
});

export default PollPreview;
