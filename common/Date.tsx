import React from 'react';
import {TextProps} from 'react-native';
import Text from './Text';
import {DateValue} from '../features/events/eventsTypes';
import {translate} from '../app/locales';

interface ProjetXDateProps extends TextProps {
  date?: DateValue;
  short?: boolean;
  onlyDate?: boolean;
}
export const dateFormat = 'ddd DD MMM YYYY';
export const dateFormatWithHour = 'ddd DD MMM YYYY HH:mm';

const Date: React.FC<ProjetXDateProps> = ({
  date,
  short,
  onlyDate,
  ...props
}) => {
  if (!date) {
    return null;
  }
  if (date.date) {
    return (
      <Text {...props}>
        {short
          ? date.date.fromNow()
          : date.date.format(onlyDate ? dateFormat : dateFormatWithHour)}
      </Text>
    );
  }
  if (date.startDate) {
    return (
      <Text {...props}>
        {date.endDate
          ? `${date.startDate.format(dateFormat)}\n${translate(
              'au',
            )} ${date.endDate.format(dateFormat)}`
          : date.startDate.format(dateFormat)}
      </Text>
    );
  }
  return null;
};

export default Date;
