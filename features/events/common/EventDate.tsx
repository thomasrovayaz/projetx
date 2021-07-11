import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {EventDateType, ProjetXEvent} from '../eventsTypes';
import {translate} from '../../../app/locales';
import {getMyId} from '../../user/usersApi';
import Button from '../../../common/Button';
import Date from '../../../common/Date';
import {useNavigation} from '@react-navigation/native';

interface ProjetXEventDateProps {
  event: ProjetXEvent;
}

interface Style {
  button: ViewStyle;
  value: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  button: {
    marginBottom: 40,
  },
  value: {
    fontSize: 14,
    marginBottom: 20,
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
});

const EventDate: React.FC<ProjetXEventDateProps> = ({event}) => {
  const navigation = useNavigation();

  if (
    (event.dateType === EventDateType.fixed && !event.date) ||
    (event.dateType === EventDateType.poll && !event.datePoll)
  ) {
    if (getMyId() === event.author) {
      return (
        <Button
          style={styles.button}
          title={translate('Ajouter une date')}
          variant="outlined"
          onPress={() => {
            navigation.navigate('CreateEventWhen', {
              backOnSave: true,
            });
          }}
        />
      );
    }
    return null;
  }

  const showPollModal = () => {
    //todo showModal Poll with pollId: event.datePoll,
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
      <Date date={event.date} style={styles.value} />
    </>
  );
};

export default EventDate;
