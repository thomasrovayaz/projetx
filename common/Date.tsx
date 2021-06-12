import React from 'react';
import {Text, TextProps} from 'react-native';
import {DateValue} from '../features/events/eventsTypes';
import {translate} from '../app/locales';

interface ProjetXDateProps extends TextProps {
  date?: DateValue;
  short?: boolean;
}
const format = 'ddd DD MMM YYYY';
const formatWithHour = 'ddd DD MMM YYYY HH:mm';

const Date: React.FC<ProjetXDateProps> = ({date, short, ...props}) => {
  if (!date) {
    return null;
  }
  if (date.date) {
    return (
      <Text {...props}>
        {short ? date.date.fromNow() : date.date.format(formatWithHour)}
      </Text>
    );
  }
  if (date.startDate) {
    return (
      <Text {...props}>
        {date.endDate
          ? `${date.startDate.format(format)}\n${translate(
              'au',
            )} ${date.endDate.format(format)}`
          : date.startDate.format(format)}
      </Text>
    );
  }
  return null;
};

export default Date;
