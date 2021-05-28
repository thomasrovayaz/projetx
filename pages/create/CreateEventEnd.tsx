import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../../components/Button';
import {translate} from '../../locales';
import {ProjetXEvent, saveEvent} from '../../api/Events';
import ShareEvent from '../../utils/ShareEvent';

interface CreateEventEndScreenProps {
  event: ProjetXEvent;
}

const CreateEventEndScreen: NavigationFunctionComponent<CreateEventEndScreenProps> =
  ({componentId, event}) => {
    const [savedEvent, setSavedEvent] = useState<ProjetXEvent>();

    const save = async (eventToSave: ProjetXEvent) => {
      setSavedEvent(await saveEvent(eventToSave));
    };

    const share = async () => ShareEvent(event);

    useEffect(() => {
      save(event);
    }, [event]);

    if (!savedEvent) {
      return null;
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.content} />
        <View style={styles.buttonNext}>
          <Button
            variant="outlined"
            title={translate("Voir l'événement")}
            onPress={() => {
              Navigation.setStackRoot(componentId, {
                component: {
                  name: 'Home',
                  passProps: {
                    event: savedEvent,
                  },
                },
              });
            }}
          />
          <Button
            title={translate("Partager le lien d'invitation")}
            onPress={share}
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonNext: {
    padding: 20,
  },
});

CreateEventEndScreen.options = {
  topBar: {
    visible: false,
  },
  bottomTabs: {
    visible: false,
  },
};

export default CreateEventEndScreen;
