import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {PollState, PollType, ProjetXPoll} from './pollsTypes';
import {DateValue} from '../events/eventsTypes';
import DateInput from '../../common/DateInput';
import {translate} from '../../app/locales';
import {LocationValue} from '../events/create/components/LocationPicker';
import IconButton from '../../common/IconButton';
import Button from '../../common/Button';
import {nanoid} from 'nanoid';
import Poll from './Poll';
import {getMe} from '../user/usersApi';
import {Navigation} from 'react-native-navigation';
import TextInput from '../../common/TextInput';

interface ProjetXPollProps {
  poll: ProjetXPoll;
  onChange(poll: ProjetXPoll): void;
  isSingleDate?: boolean;
}

const PollCreator: React.FC<ProjetXPollProps> = ({
  poll,
  onChange,
  isSingleDate,
}) => {
  const me = getMe().uid;
  if (!poll) {
    return null;
  }

  if (poll.state === PollState.FINISHED) {
    return (
      <View style={styles.content}>
        <Poll poll={poll} myAnswers={poll.answers[me]} showResult />
      </View>
    );
  }

  const addChoice = () => {
    onChange({
      ...poll,
      choices: [...poll.choices, {id: nanoid(), value: undefined}],
    });
  };
  const onChangeChoice = (
    id: string,
    value: DateValue | LocationValue | string,
  ) => {
    onChange({
      ...poll,
      choices: poll.choices.map(choice => {
        if (choice.id === id) {
          return {id, value};
        }
        return choice;
      }),
    });
  };
  const removeChoice = (id: string) => {
    onChange({
      ...poll,
      choices: poll.choices.filter(choice => choice.id !== id),
    });
  };
  const showSettings = () => {
    Navigation.showOverlay({
      component: {
        name: 'PollSettings',
        passProps: {
          poll,
          onChange,
        },
      },
    });
  };

  return (
    <View style={styles.content}>
      <FlatList
        contentContainerStyle={styles.choicesList}
        data={poll.choices}
        renderItem={({item: {id, value}}) => {
          let input;
          switch (poll.type) {
            case PollType.DATE:
              const dateValue = value as DateValue;
              input = (
                <DateInput
                  style={styles.item}
                  range={!isSingleDate}
                  value={dateValue}
                  onChange={newValue => {
                    onChangeChoice(id, newValue);
                  }}
                  placeholder={translate('Ajouter une date')}
                />
              );
              break;
            default:
              input = (
                <TextInput
                  style={styles.item}
                  value={value as string}
                  onChangeText={newValue => {
                    onChangeChoice(id, newValue);
                  }}
                  placeholder={translate('Ajouter un choix')}
                />
              );
          }
          return (
            <View style={styles.itemContainer}>
              {input}
              <IconButton
                name="trash"
                size={22}
                style={styles.itemAction}
                onPress={() => removeChoice(id)}
              />
            </View>
          );
        }}
        ListFooterComponent={
          <View style={styles.itemContainer}>
            <Button
              style={styles.item}
              variant="outlined"
              onPress={addChoice}
              title={translate('+ Ajouter une option')}
            />
            <IconButton
              name="settings"
              style={styles.itemAction}
              size={22}
              onPress={showSettings}
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    flex: 1,
  },
  choicesList: {},
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  item: {
    flex: 1,
  },
  itemAction: {
    padding: 10,
  },
});

export default PollCreator;
