import React from 'react';
import {StyleSheet, Text, ViewStyle} from 'react-native';
import {ProjetXEvent} from '../api/Events';
import {translate} from '../locales';
import Label from './Label';
import {getMe} from '../api/Users';
import Button from './Button';
import {Navigation} from 'react-native-navigation';
import moment from 'moment';

interface ProjetXEventDateProps {
  componentId: string;
  event: ProjetXEvent;
  onUpdate(newEvent: ProjetXEvent): void;
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

const EventDate: React.FC<ProjetXEventDateProps> = ({
  componentId,
  event,
  onUpdate,
}) => {
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
                  onSave: (newEvent: ProjetXEvent) => {
                    Navigation.pop(componentId);
                    onUpdate(newEvent);
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
