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
  }, [poll]);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
      <View style={styles.content}>
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

PollModal.options = {
  topBar: {
    title: {
      text: translate('Sondage'),
    },
  },
};

export default PollModal;
