import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {useAppSelector} from '../../app/redux';
import {selectPoll} from './pollsSlice';
import {getPoll, updatePollAnswers} from './pollsApi';
import {getMe} from '../user/usersApi';
import Button from '../../common/Button';
import {translate} from '../../app/locales';
import {PollState} from './pollsTypes';
import Poll from './Poll';
import {EventDateType, ProjetXEvent} from '../events/eventsTypes';
import Title from '../../common/Title';

interface ProjetXPollProps {
  pollId: string;
}

const PollModal: NavigationFunctionComponent<ProjetXPollProps> = ({
  pollId,
  componentId,
}) => {
  const me = getMe().uid;
  const poll = useAppSelector(selectPoll(pollId));
  const [myAnswers, setMyAnswers] = useState<string[]>(poll?.answers[me]);
  const [hasAnswered, setHasAnswered] = useState(myAnswers?.length > 0);

  useEffect(() => {
    getPoll(pollId);
  }, [pollId]);
  useEffect(() => {
    if (poll && !myAnswers) {
      const myNewAnswers = poll.answers[me] || [];
      setMyAnswers(myNewAnswers);
      setHasAnswered(myNewAnswers.length > 0);
    }
  }, [me, myAnswers, poll]);
  if (!poll) {
    return null;
  }
  const isMultiplePoll = poll.settings.multiple;

  const validAnswers = async (newAnswers: string[]) => {
    await updatePollAnswers(poll, newAnswers);
    setHasAnswered(true);
  };
  const edit = () => {
    Navigation.push(componentId, {
      component: {
        name: 'CreateEventWhen',
        passProps: {
          onSave: async (event: ProjetXEvent) => {
            if (event.dateType === EventDateType.fixed) {
              await Navigation.dismissModal(componentId);
            } else {
              await Navigation.pop(componentId);
            }
          },
        },
      },
    });
  };

  const closeButton = (
    <Button
      variant="outlined"
      style={styles.cta}
      title={translate('Fermer')}
      onPress={() => Navigation.dismissModal(componentId)}
    />
  );
  const validMultipleAnswers = (
    <Button
      title={translate('Valider')}
      style={[styles.cta, styles.ctaLeft]}
      onPress={() => validAnswers(myAnswers)}
    />
  );
  const editButton = (
    <Button
      title={translate('Modifier')}
      style={[styles.cta, styles.ctaLeft]}
      onPress={edit}
    />
  );
  const renderCTAs = () => {
    if (poll.author === getMe().uid) {
      if (hasAnswered || !isMultiplePoll) {
        return (
          <>
            {editButton}
            {closeButton}
          </>
        );
      }
      if (isMultiplePoll) {
        return (
          <>
            {validMultipleAnswers}
            {closeButton}
          </>
        );
      }
    }
    if (hasAnswered || !isMultiplePoll) {
      return closeButton;
    }
    if (isMultiplePoll) {
      return (
        <>
          {validMultipleAnswers}
          {closeButton}
        </>
      );
    }
  };
  const onChange = async (newAnswers: []) => {
    setMyAnswers(newAnswers);
    if (!isMultiplePoll) {
      await validAnswers(newAnswers);
    }
  };

  const showResult = poll.state === PollState.FINISHED || hasAnswered;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
      <View style={styles.content}>
        <Title style={styles.title}>
          {showResult
            ? translate('Voici les résultats')
            : isMultiplePoll
            ? translate('Quel sont tes choix ?')
            : translate('Quel est ton choix ?')}
        </Title>
        <Poll
          poll={poll}
          myAnswers={myAnswers}
          onChange={onChange}
          showResult={poll.state === PollState.FINISHED || hasAnswered}
        />
        <View style={styles.buttons}>{renderCTAs()}</View>
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
  title: {
    marginBottom: 10,
  },
  buttons: {
    marginTop: 20,
    flexDirection: 'row',
  },
  cta: {
    flex: 1,
  },
  ctaLeft: {
    marginRight: 10,
  },
});

PollModal.options = {
  topBar: {
    title: {
      text: translate('Sondage'),
    },
  },
};

export default PollModal;
