import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {ProjetXEvent} from '../eventsTypes';
import {translate} from '../../../app/locales';
import Button from '../../../common/Button';
import Text from '../../../common/Text';
import {useNavigation} from '@react-navigation/native';

interface ProjetXEventDescriptionProps {
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
    fontSize: 18,
    marginBottom: 40,
  },
});

const EventDescription: React.FC<ProjetXEventDescriptionProps> = ({event}) => {
  const navigation = useNavigation();

  if (!event.description) {
    if (event.isAuthor()) {
      return (
        <Button
          style={styles.button}
          title={translate('Ajouter une description')}
          variant="outlined"
          onPress={() => {
            navigation.navigate('CreateEventWhat', {
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
      <Text style={styles.value}>{event.description}</Text>
    </>
  );
};

export default EventDescription;
