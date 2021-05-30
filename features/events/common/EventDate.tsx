import React from 'react';
import {StyleSheet, Text, ViewStyle} from 'react-native';
import {ProjetXEvent} from '../eventsTypes';
import {translate} from '../../../app/locales';
import Label from '../../../common/Label';
import {getMe} from '../../user/usersApi';
import Button from '../../../common/Button';
import {Navigation} from 'react-native-navigation';

interface ProjetXEventDateProps {
  componentId: string;
  event: ProjetXEvent;
}

interface Style {
  button: ViewStyle;
  value: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  button: {
    marginBottom: 20,
  },
  value: {
    fontFamily: 'Inter',
    fontSize: 14,
    marginBottom: 20,
  },
});

const format = 'ddd DD MMM YYYY';

const EventDate: React.FC<ProjetXEventDateProps> = ({componentId, event}) => {
  if (!event.date) {
    const me = getMe()?.uid;
    if (me === event.author) {
      return (
        <Button
          style={styles.button}
          title={translate('Ajouter une date')}
          variant="outlined"
          onPress={() => {
            Navigation.push(componentId, {
              component: {
                name: 'CreateEventWhen',
                passProps: {
                  event,
                  onSave: () => {
                    Navigation.pop(componentId);
                  },
                },
              },
            });
          }}
        />
      );
    }
    return null;
  }

  const renderDate = () => {
    if (!event.date) {
      return null;
    }
    if (event.date.date) {
      return <Text style={styles.value}>{event.date.date.fromNow()}</Text>;
    }
    if (event.date.startDate) {
      return (
        <Text style={styles.value}>
          {event.date.endDate
            ? `${event.date.startDate.format(
                format,
              )} -> ${event.date.endDate.format(format)}`
            : event.date.startDate.format(format)}
        </Text>
      );
    }
  };
  return (
    <>
      <Label>{translate('Quand?')}</Label>
      {renderDate()}
    </>
  );
};

export default EventDate;
