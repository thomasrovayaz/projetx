import React from 'react';
import {StyleSheet, Text, ViewStyle} from 'react-native';
import {ProjetXEvent} from '../eventsTypes';
import {translate} from '../../../app/locales';
import Label from '../../../common/Label';
import Button from '../../../common/Button';
import {Navigation} from 'react-native-navigation';

interface ProjetXEventDescriptionProps {
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

const EventDescription: React.FC<ProjetXEventDescriptionProps> = ({
  componentId,
  event,
}) => {
  if (!event.description) {
    if (event.isAuthor()) {
      return (
        <Button
          style={styles.button}
          title={translate('Ajouter une description')}
          variant="outlined"
          onPress={() => {
            Navigation.push(componentId, {
              component: {
                name: 'CreateEventWhat',
                passProps: {
                  onSave: async () => {
                    await Navigation.pop(componentId);
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
  return (
    <>
      <Label>{translate('Description')}</Label>
      <Text style={styles.value}>{event.description}</Text>
    </>
  );
};

export default EventDescription;
