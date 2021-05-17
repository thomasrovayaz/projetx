import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../../components/Button';
import {translate} from '../../locales';
import {ProjetXEvent} from '../../api/Events';
import TextInput from '../../components/TextInput';

interface CreateEventWhatScreenProps {
  event?: ProjetXEvent;
}

const CreateEventWhatScreen: NavigationFunctionComponent<CreateEventWhatScreenProps> =
  ({componentId, event}) => {
    const [title, setTitle] = useState<string>();
    const [description, setDescription] = useState<string>();

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <View style={styles.content}>
          <View style={styles.input}>
            <TextInput
              label={translate('Titre')}
              value={title}
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
        </View>
        <View style={styles.buttonNext}>
          <Button
            title={translate('Suivant >')}
            onPress={() =>
              Navigation.push(componentId, {
                component: {
                  name: 'CreateEventEnd',
                  passProps: {
                    event: {
                      ...event,
                      title,
                      description,
                    },
                  },
                },
              })
            }
          />
        </View>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
      text: translate('Description'),
    },
  },
  bottomTabs: {
    visible: false,
  },
};

export default CreateEventWhatScreen;
