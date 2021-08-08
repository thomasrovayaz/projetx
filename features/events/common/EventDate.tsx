import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {ProjetXEvent} from '../eventsTypes';
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

  if (!event.date) {
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

  return (
    <>
      <Date date={event.date} style={styles.value} />
    </>
  );
};

export default EventDate;
