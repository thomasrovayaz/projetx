import React from 'react';
import {StyleSheet, Text, ViewStyle} from 'react-native';
import {ProjetXEvent} from '../api/Events';
import {translate} from '../locales';
import Label from './Label';
import {getMe} from '../api/Users';
import Button from './Button';
import {Navigation} from 'react-native-navigation';

interface ProjetXEventDescriptionProps {
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

const EventDescription: React.FC<ProjetXEventDescriptionProps> = ({
  componentId,
  event,
  onUpdate,
}) => {
  if (!event.description) {
    const me = getMe()?.uid;
    if (me === event.author) {
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
  return (
    <>
      <Label>{translate('Description')}</Label>
      <Text style={styles.value}>{event.description}</Text>
    </>
  );
};

export default EventDescription;
