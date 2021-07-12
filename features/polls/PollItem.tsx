import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {PollType} from './pollsTypes';
import {DateValue} from '../events/eventsTypes';
import Date from '../../common/Date';
import Text from '../../common/Text';
import {LocationValue} from '../events/create/components/LocationPicker';
import {translate} from '../../app/locales';
import {LIGHT_BLUE} from '../../app/colors';
import {Checkbox} from '../../common/CheckboxInput';

interface ProjetXPollItemProps {
  onPress(): void;
  selected?: boolean;
  showResult?: boolean;
  isMultipleChoices?: boolean;
  type: PollType;
  value: DateValue | LocationValue | string;
  count: number;
  totalVote: number;
}

const PollItem: React.FC<ProjetXPollItemProps> = ({
  onPress,
  selected,
  isMultipleChoices,
  type,
  value,
  showResult,
  count = 0,
  totalVote,
}) => {
  let input;
  switch (type) {
    case PollType.DATE:
      const dateValue = value as DateValue;
      input = (
        <Date
          date={dateValue}
          onlyDate
          style={[styles.item, selected ? styles.itemSelected : {}]}
        />
      );
      break;
    default:
      input = <Text style={selected ? styles.itemSelected : {}}>{value}</Text>;
  }
  const percent = showResult ? `${(count / totalVote) * 100}%` : 0;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}>
      <View
        style={[
          StyleSheet.absoluteFill,
          showResult ? styles.progressBar : {},
          {width: percent},
        ]}
      />
      <View style={[StyleSheet.absoluteFill, styles.itemContainer]}>
        {isMultipleChoices ? <Checkbox selected={selected} /> : null}
        {input}
        {showResult ? (
          <Text style={styles.itemCount}>
            {translate('votes', {count: count || 0})}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 50,
    borderRadius: 15,
    marginTop: 5,
    overflow: 'hidden',
  },
  itemContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  progressBar: {
    borderRadius: 13,
    backgroundColor: LIGHT_BLUE,
  },
  item: {},
  itemSelected: {
    fontWeight: '700',
  },
  itemCount: {
    flex: 1,
    textAlign: 'right',
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
  },
  closeButton: {},
});

export default PollItem;
