import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {PollType} from './pollsTypes';
import {DateValue} from '../events/eventsTypes';
import Date from '../../common/Date';
import Text from '../../common/Text';
import {LocationValue} from '../events/create/components/LocationPicker';
import {translate} from '../../app/locales';
import {DARK_BLUE, LIGHT_BLUE} from '../../app/colors';
import {Checkbox} from '../../common/CheckboxInput';
import MaskedView from '@react-native-community/masked-view';
import {Radio} from '../../common/RadioInput';

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
      input = (
        <Date
          date={value as DateValue}
          onlyDate
          style={[styles.item, selected ? styles.itemSelected : {}]}
        />
      );
      break;
    default:
      input = (
        <Text style={[styles.item, selected ? styles.itemSelected : {}]}>
          {value}
        </Text>
      );
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
      {isMultipleChoices ? (
        <Checkbox style={styles.checkbox} white={!count} selected={selected} />
      ) : (
        <Radio style={styles.checkbox} white={!count} selected={selected} />
      )}
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <View style={[StyleSheet.absoluteFill, styles.itemContainer]}>
            {input}
            {showResult ? (
              <Text style={styles.itemCount}>
                {translate('votes', {count: count || 0})}
              </Text>
            ) : null}
          </View>
        }>
        <View style={[StyleSheet.absoluteFill, {backgroundColor: 'white'}]} />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              width: percent,
              backgroundColor: DARK_BLUE,
            },
          ]}
        />
      </MaskedView>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  maskedView: {
    flex: 1,
    height: '100%',
  },
  checkbox: {
    position: 'absolute',
    left: 10,
  },
  itemContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    left: 25,
  },
  progressBar: {
    borderRadius: 13,
    backgroundColor: LIGHT_BLUE,
  },
  item: {color: 'white'},
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
