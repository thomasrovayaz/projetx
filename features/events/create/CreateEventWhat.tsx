import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import {ProjetXEvent} from '../eventsTypes';
import {saveEvent} from '../eventsApi';
import TextInput from '../../../common/TextInput';
import {useSelector} from 'react-redux';
import {selectCurrentEvent} from '../eventsSlice';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface CreateEventWhatScreenProps {
  onSave?(newEvent: ProjetXEvent): void;
}

const CreateEventWhatScreen: NavigationFunctionComponent<CreateEventWhatScreenProps> =
  ({componentId, onSave}) => {
    const event = useSelector(selectCurrentEvent);
    const [title, setTitle] = useState<string | undefined>(event?.title);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [description, setDescription] = useState<string | undefined>(
      event?.description,
    );
    if (!event) {
      return null;
    }

    const submit = async () => {
      if (!title || title === '') {
        setSubmitted(true);
        return;
      }
      event.title = title;
      event.description = description;
      if (event.id) {
        await saveEvent(event);
      }
      if (onSave) {
        return onSave(event);
      }
      await Navigation.push(componentId, {
        component: {
          name: 'CreateEventEnd',
        },
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
        <KeyboardAwareScrollView style={styles.content}>
          <View style={styles.input}>
            <TextInput
              label={translate('Titre')}
              value={title}
              error={
                submitted && (!title || title === '')
                  ? translate('Un titre est requis')
                  : undefined
              }
              onChangeText={setTitle}
              placeholder={translate('Un super titre')}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              label={translate('Description')}
              maxLength={1000}
              value={description}
              multiline
              onChangeText={setDescription}
              placeholder={translate('Et une petite description...')}
            />
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.buttonNext}>
          <Button
            title={translate(
              onSave ? 'Enregistrer' : 'Envoyer les invitations',
            )}
            onPress={submit}
          />
        </View>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
  },
  input: {
    marginVertical: 20,
  },
  buttonNext: {
    padding: 20,
  },
});

CreateEventWhatScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: translate('Détails'),
    },
  },
  bottomTabs: {
    visible: false,
  },
};

export default CreateEventWhatScreen;
