import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {PollType, ProjetXPoll} from './pollsTypes';
import {DateValue} from '../events/eventsTypes';
import DateInput from '../../common/DateInput';
import {translate} from '../../app/locales';
import {LocationValue} from '../events/create/components/LocationPicker';
import IconButton from '../../common/IconButton';
import Button from '../../common/Button';
import {nanoid} from 'nanoid';

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
  if (!poll) {
    return null;
  }

  const addChoice = () => {
    onChange({
      ...poll,
      choices: [...poll.choices, {id: nanoid(), value: undefined}],
    });
  };
  const onChangeChoice = (id: string, value: DateValue | LocationValue) => {
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
              onPress={() => {}}
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
    marginBottom: 10,
  },
  item: {
    flex: 1,
  },
  itemAction: {
    padding: 10,
  },
});

export default PollCreator;
