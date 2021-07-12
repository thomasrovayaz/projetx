import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {translate} from '../../app/locales';
import {PollType, ProjetXPoll} from './pollsTypes';
import PollCreator from './PollCreator';
import {createPoll, savePoll} from './pollsApi';
import Title from '../../common/Title';
import Button from '../../common/Button';
import TextInput from '../../common/TextInput';
import {useNavigation} from '@react-navigation/native';
import {sendPollMessage} from './pollsUtils';
import {BEIGE} from '../../app/colors';
import Label from '../../common/Label';

interface CreatePollTypeScreenProps {
  route: {
    params: {
      type?: PollType;
      poll?: ProjetXPoll;
      parentId: string;
      parentTitle: string;
      usersToNotify?: string[];
    };
  };
}

const CreatePollChoicesScreen: React.FC<CreatePollTypeScreenProps> = ({
  route: {
    params: {type = PollType.OTHER, parentId, parentTitle, usersToNotify, poll},
  },
}) => {
  const navigation = useNavigation();
  const [currentPoll, setCurrentPoll] = useState<ProjetXPoll>(
    poll || createPoll(type, parentId),
  );
  const [submitted, setSubmitted] = useState<boolean>(false);

  const save = async () => {
    if (!currentPoll.title || currentPoll.title === '') {
      setSubmitted(true);
      return;
    }
    const newPoll = await savePoll(currentPoll);
    if (!poll && usersToNotify) {
      await sendPollMessage(newPoll, parentId, parentTitle, usersToNotify);
    }
    navigation.goBack();
  };
  const cancel = async () => {
    navigation.goBack();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Label>{translate('Options')}</Label>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 40,
  },
  input: {
    marginBottom: 40,
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
