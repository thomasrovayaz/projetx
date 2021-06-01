import React from 'react';
import {StyleSheet, Text, ViewStyle} from 'react-native';
import {EventDateType, ProjetXEvent} from '../eventsTypes';
import {translate} from '../../../app/locales';
import Label from '../../../common/Label';
import {getMe} from '../../user/usersApi';
import Button from '../../../common/Button';
import {Navigation} from 'react-native-navigation';
import Date from '../../../common/Date';

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
  if (
    (event.dateType === EventDateType.fixed && !event.date) ||
    (event.dateType === EventDateType.poll && !event.datePoll)
  ) {
    if (getMe().uid === event.author) {
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

  const showPollModal = () => {
    return Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: 'Poll',
              passProps: {
                pollId: event.datePoll,
              },
            },
          },
        ],
      },
    });
  };

  if (event.dateType === EventDateType.poll) {
    return (
      <Button
        icon="calendar"
        style={styles.button}
        title={translate('Sondage pour la date')}
        variant="outlined"
        onPress={showPollModal}
      />
    );
  }

  return (
    <>
      <Label>{translate('Quand?')}</Label>
      <Date date={event.date} short style={styles.value} />
    </>
  );
};

export default EventDate;
