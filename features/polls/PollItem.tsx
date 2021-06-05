import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {PollType} from './pollsTypes';
import {DateValue} from '../events/eventsTypes';
import Date from '../../common/Date';
import Icon from 'react-native-vector-icons/Feather';
import {LocationValue} from '../events/create/components/LocationPicker';
import {translate} from '../../app/locales';
import MaskedView from '@react-native-community/masked-view';

interface ProjetXPollItemProps {
  onPress(): void;
  selected?: boolean;
  showResult?: boolean;
  type: PollType;
  value: DateValue | LocationValue;
  count: number;
  totalVote: number;
}

const PollItem: React.FC<ProjetXPollItemProps> = ({
  onPress,
  selected,
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
          style={[styles.item, selected ? styles.itemSelected : {}]}
        />
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
      <MaskedView
        style={[StyleSheet.absoluteFill]}
        maskElement={
          <View style={[StyleSheet.absoluteFill, styles.itemContainer]}>
            {selected ? (
              <Icon
                name="check"
                size={20}
                style={[styles.itemIcon, selected ? styles.itemSelected : {}]}
              />
            ) : null}
            {input}
            {showResult ? (
              <Text style={styles.itemCount}>
                {translate('votes', {count: count || 0})}
              </Text>
            ) : null}
          </View>
        }>
        <View style={[StyleSheet.absoluteFill, {backgroundColor: '#473B78'}]} />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              width: percent,
              backgroundColor: '#fff',
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
    height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(71,59,120,0.05)',
    borderColor: '#473B78',
    borderWidth: 1,
    marginBottom: 10,
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
  itemCount: {
    flex: 1,
    color: 'white',
    textAlign: 'right',
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
  },
  closeButton: {},
});

export default PollItem;
