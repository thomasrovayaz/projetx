import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../../common/Button';
import {translate} from '../../app/locales';
import {ProjetXPoll} from './pollsTypes';
import Checkbox from '../../common/Checkbox';
import Title from '../../common/Title';

interface ProjetXPollProps {
  poll: ProjetXPoll;
  onChange(poll: ProjetXPoll): void;
}

const PollSettings: NavigationFunctionComponent<ProjetXPollProps> = ({
  poll,
  componentId,
  onChange,
}) => {
  const [settings, setSettings] = useState(poll.settings);
  const dismiss = () => Navigation.dismissOverlay(componentId);

  useEffect(() => {
    setSettings(poll.settings);
  }, [poll]);

  return (
    <View style={styles.root}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.backdrop}
        onPress={dismiss}
      />
      <View style={styles.alert}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00000050',
  },
  alert: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    flexDirection: 'column',
    width: '80%',
    elevation: 4,
    padding: 20,
  },
  content: {
    marginVertical: 20,
    width: '100%',
    flexDirection: 'column',
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

PollSettings.options = {
  layout: {
    componentBackgroundColor: 'transparent',
  },
  overlay: {
    interceptTouchOutside: true,
  },
};

export default PollSettings;
