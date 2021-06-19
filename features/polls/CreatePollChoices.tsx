import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {translate} from '../../app/locales';
import {PollState, PollType, ProjetXPoll} from './pollsTypes';
import PollCreator from './PollCreator';
import {savePoll} from './pollsApi';
import {nanoid} from 'nanoid';
import Title from '../../common/Title';
import Button from '../../common/Button';
import TextInput from '../../common/TextInput';

interface CreatePollTypeScreenProps {
  type?: PollType;
  poll?: ProjetXPoll;
  parentId?: string;
}

const CreatePollChoicesScreen: NavigationFunctionComponent<CreatePollTypeScreenProps> =
  ({componentId, type = PollType.OTHER, parentId, poll}) => {
    const [currentPoll, setCurrentPoll] = useState<ProjetXPoll>(
      poll ||
        new ProjetXPoll({
          type,
          parentId,
          state: PollState.RUNNING,
          id: nanoid(11),
        }),
    );
    const [submitted, setSubmitted] = useState<boolean>(false);

    const save = async () => {
      if (!currentPoll.title || currentPoll.title === '') {
        setSubmitted(true);
        return;
      }
      await savePoll(currentPoll);
      await Navigation.dismissModal(componentId);
    };
    const cancel = async () => Navigation.dismissModal(componentId);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
        <View style={styles.content}>
          <Title style={styles.title}>
            {translate('Quels sont les options ?')}
          </Title>
          <View style={styles.input}>
            <TextInput
              label={translate('Titre du sondage')}
              error={
                submitted && (!currentPoll.title || currentPoll.title === '')
                  ? translate("J'ai besoin d'un titre pour le sondage")
                  : undefined
              }
              value={currentPoll.title}
              onChangeText={text => {
                setCurrentPoll({
                  ...currentPoll,
                  title: text,
                });
              }}
              returnKeyType="done"
              placeholder={translate('Quand êtes-vous dispo ?')}
            />
          </View>
          <PollCreator
            poll={currentPoll}
            onChange={setCurrentPoll}
            isSingleDate
          />
        </View>
        <View style={styles.ctas}>
          <Button
            style={[styles.cta, styles.ctaLeft]}
            title={translate('Créer le sondage')}
            onPress={save}
          />
          <Button
            style={[styles.cta, styles.ctaRight]}
            variant="outlined"
            title={translate('Annuler')}
            onPress={cancel}
          />
        </View>
      </SafeAreaView>
    );
  };

CreatePollChoicesScreen.options = {
  topBar: {
    title: {
      text: translate('Les options'),
    },
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    width: '100%',
  },
  ctas: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    flex: 1,
  },
  ctaLeft: {
    flex: 1,
    marginRight: 5,
  },
  ctaRight: {
    flex: 1,
    marginLeft: 5,
  },
});

export default CreatePollChoicesScreen;
