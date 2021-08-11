import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {translate} from '../../app/locales';
import {PollState, ProjetXPoll} from './pollsTypes';
import PollChoicesCreator from './PollChoicesCreator';
import {savePoll} from './pollsApi';
import Title from '../../common/Title';
import Button from '../../common/Button';
import TextInput from '../../common/TextInput';
import Label from '../../common/Label';
import _ from 'lodash';
import {RED} from '../../app/colors';

interface CreatePollTypeScreenProps {
  poll: ProjetXPoll;
  onSave(poll: ProjetXPoll): void;
  onCancel(): void;
  saveLabel?: string;
}

const PollEditor: React.FC<CreatePollTypeScreenProps> = ({
  poll,
  onSave,
  onCancel,
  saveLabel,
}) => {
  const [currentPoll, setCurrentPoll] = useState<ProjetXPoll>(poll);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [hasChanged, setHasChanged] = useState<boolean>(false);

  useEffect(() => {
    setCurrentPoll(poll);
  }, [poll]);
  useEffect(() => {
    setHasChanged(!_.isEqual(poll, currentPoll));
  }, [poll, currentPoll]);

  if (!currentPoll) {
    return null;
  }

  const save = async () => {
    if (!currentPoll.title || currentPoll.title === '') {
      setSubmitted(true);
      return;
    }
    onSave(await savePoll({...currentPoll, state: PollState.RUNNING}));
  };

  const endPoll = async () => {
    onSave(await savePoll({...poll, state: PollState.FINISHED}));
  };
  const restartPoll = async () => {
    onSave(await savePoll({...poll, state: PollState.RUNNING}));
  };

  return (
    <>
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
        <PollChoicesCreator
          poll={currentPoll}
          onChange={setCurrentPoll}
          isSingleDate
        />
      </View>
      <View style={styles.ctas}>
        {hasChanged ? (
          <Button
            style={[styles.cta, styles.ctaLeft]}
            title={saveLabel || translate('Enregistrer')}
            onPress={save}
          />
        ) : currentPoll.state === PollState.RUNNING ? (
          <Button
            icon={'power'}
            variant="outlined"
            textStyle={styles.endPollButtonText}
            style={[styles.cta, styles.ctaLeft, styles.endPollButton]}
            iconStyle={styles.endPollButtonText}
            title={translate('Fin du sondage')}
            onPress={endPoll}
          />
        ) : currentPoll.state === PollState.FINISHED ? (
          <Button
            icon={'play-circle'}
            variant="outlined"
            style={[styles.cta, styles.ctaLeft]}
            title={translate('Reprendre')}
            onPress={restartPoll}
          />
        ) : (
          <View style={[styles.cta, styles.ctaLeft]} />
        )}
        <Button
          style={[styles.cta, styles.ctaRight]}
          variant="outlined"
          title={translate('Annuler')}
          onPress={onCancel}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
  endPollButtonText: {
    color: RED,
  },
  endPollButton: {
    borderColor: RED,
  },
});

export default PollEditor;
