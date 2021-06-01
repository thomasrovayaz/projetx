import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {useAppSelector} from '../../app/redux';
import {selectPoll} from './pollsSlice';
import {getPoll, updatePollAnswers} from './pollsApi';
import {PollType} from './pollsTypes';
import {DateValue} from '../events/eventsTypes';
import Date from '../../common/Date';
import Icon from 'react-native-vector-icons/Feather';
import {getMe} from '../user/usersApi';
import Button from '../../common/Button';
import {translate} from '../../app/locales';

interface ProjetXPollProps {
  pollId: string;
}

const PollModal: NavigationFunctionComponent<ProjetXPollProps> = ({
  pollId,
  componentId,
}) => {
  const poll = useAppSelector(selectPoll(pollId));
  const me = getMe().uid;
  const [answers, setAnswers] = useState(poll.answers[me] || []);

  useEffect(() => {
    getPoll(pollId);
  }, [pollId]);
  useEffect(() => {
    setAnswers(poll.answers[me] || []);
  }, [poll.answers, me]);
  const isMultiplePoll = poll.settings.multiple;

  const toggleAnswer = (answerId: string) => {
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
  const validAnswers = (newAnswers: string[]) => {
    updatePollAnswers(poll, newAnswers);
    Navigation.dismissModal(componentId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
      <View style={styles.content}>
        <FlatList
          contentContainerStyle={styles.choicesList}
          data={poll.choices.filter((choice: any) => Boolean(choice.value))}
          renderItem={({item: {id, value}}) => {
            const isSelected = answers.includes(id);
            let input;
            switch (poll.type) {
              case PollType.DATE:
                const dateValue = value as DateValue;
                input = (
                  <Date
                    date={dateValue}
                    style={[styles.item, isSelected ? styles.itemSelected : {}]}
                  />
                );
            }
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleAnswer(id)}
                style={[
                  styles.itemContainer,
                  isSelected ? styles.itemContainerSelected : {},
                ]}>
                <Icon
                  name="calendar"
                  size={20}
                  style={[
                    styles.itemIcon,
                    isSelected ? styles.itemSelected : {},
                  ]}
                />
                {input}
              </TouchableOpacity>
            );
          }}
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
