import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React, {useEffect, useState} from 'react';
import IconButton from '../../common/IconButton';
import {BEIGE, DARK_BLUE} from '../../app/colors';
import Title from '../../common/Title';
import {translate} from '../../app/locales';
import Button from '../../common/Button';
import ProjetXModal from '../../common/Modal';
import Checkbox from '../../common/Checkbox';
import {ProjetXPoll} from './pollsTypes';

interface ProjetXPollSettingsButtonProps {
  poll: ProjetXPoll;
  onChange(poll: ProjetXPoll): void;
  style?: StyleProp<ViewStyle>;
}

const PollSettingsButton: React.FC<ProjetXPollSettingsButtonProps> = ({
  poll,
  onChange,
  style,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [settings, setSettings] = useState(poll.settings);
  const dismiss = () => setModalVisible(false);

  useEffect(() => {
    setSettings(poll.settings);
  }, [poll, modalVisible]);

  return (
    <>
      <IconButton
        name={'settings'}
        color={DARK_BLUE}
        size={22}
        onPress={() => setModalVisible(true)}
        style={style}
      />
      <ProjetXModal
        style={styles.popup}
        height={300}
        open={modalVisible}
        onClose={dismiss}>
        <Title>{translate('Paramètres du sondage')}</Title>
        <View style={styles.content}>
          <Checkbox
            label={translate('Choix multiple')}
            selected={settings.multiple}
            onSelect={selected => {
              setSettings({
                ...poll.settings,
                multiple: selected,
              });
            }}
          />
          <Checkbox
            label={translate('Choix personnalisé')}
            selected={settings.custom}
            onSelect={selected => {
              setSettings({
                ...poll.settings,
                custom: selected,
              });
            }}
          />
        </View>
        <View style={styles.ctas}>
          <Button
            style={[styles.cta, styles.ctaLeft]}
            title="Ok"
            onPress={() => {
              onChange({...poll, settings});
              dismiss();
            }}
          />
          <Button
            style={[styles.cta, styles.ctaRight]}
            title={translate('Annuler')}
            variant={'outlined'}
            onPress={dismiss}
          />
        </View>
      </ProjetXModal>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 40,
  },
  button: {
    marginBottom: 20,
  },
  content: {
    marginVertical: 20,
    width: '100%',
    flexDirection: 'column',
  },
  popup: {
    backgroundColor: BEIGE,
  },
  ctas: {
    flexDirection: 'row',
  },
  cta: {
    flex: 1,
  },
  ctaLeft: {
    marginRight: 5,
  },
  ctaRight: {
    marginLeft: 5,
  },
});

export default PollSettingsButton;
