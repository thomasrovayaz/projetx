import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Title from '../../common/Title';
import {translate} from '../../app/locales';
import PseudoInput from './common/PseudoInput';
import BackButton from '../../common/BackButton';
import AvatarEditor from './AvatarEditor';
import Label from '../../common/Label';
import CheckboxInput from '../../common/CheckboxInput';
import {useAppSelector} from '../../app/redux';
import {selectUser} from './usersSlice';
import {getMyId, updateSetting} from './usersApi';
import RadioInput from '../../common/RadioInput';
import {VisibilitySettings} from './usersTypes';
import DescriptionInput from './common/DescriptionInput';

const SettingsScreen: React.FC = () => {
  const myProfile = useAppSelector(selectUser(getMyId()));
  const setSetting = (key: string) => async (selected: string | boolean) => {
    await updateSetting(key, selected);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <View style={styles.header}>
        <BackButton />
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}>
        <View style={styles.content}>
          <Title style={styles.title}>{translate('Mes préférences')}</Title>
          <AvatarEditor />
          <View style={styles.input}>
            <PseudoInput label={translate('Pseudo')} />
          </View>
          <View style={styles.input}>
            <DescriptionInput label={translate('Description')} />
          </View>
          <View style={styles.notifications}>
            <Label>{translate('Notifications')}</Label>
            <CheckboxInput
              label={translate("🎉 Pour les invitations d'événement")}
              onSelect={setSetting('eventNotification')}
              selected={myProfile.settings.eventNotification !== false}
            />
            <CheckboxInput
              label={translate('🍻 Pour les nouveaux groupes')}
              onSelect={setSetting('groupNotification')}
              selected={myProfile.settings.eventNotification !== false}
            />
            <CheckboxInput
              label={translate('💬 Pour les nouveaux messages')}
              onSelect={setSetting('messageNotification')}
              selected={myProfile.settings.messageNotification !== false}
            />
            <CheckboxInput
              label={translate('👉 Quand on me mentionne')}
              onSelect={setSetting('mentionNotification')}
              selected={myProfile.settings.mentionNotification !== false}
            />
          </View>
          <View style={styles.visibility}>
            <Label>{translate('Visibilité de mon profil')}</Label>
            <RadioInput
              options={[
                {
                  label: translate('🙌 Visible par tous'),
                  value: VisibilitySettings.all,
                },
                {
                  label: translate(
                    '👀 Uniquement par ceux qui ont partagé un groupe ou un événement avec moi',
                  ),
                  value: VisibilitySettings.friends,
                },
                {
                  label: translate('🤫 Invisible'),
                  value: VisibilitySettings.never,
                },
              ]}
              onSelect={value => {
                if (value !== VisibilitySettings.never) {
                  setSetting('visibility')(value);
                  return;
                }
                Alert.alert(
                  translate('Tes amis ne pourront pas te trouver 🤔'),
                  translate('Es-tu sûr?'),
                  [
                    {
                      text: translate('Non'),
                      style: 'cancel',
                    },
                    {
                      text: translate('Oui'),
                      onPress: () => setSetting('visibility')(value),
                    },
                  ],
                );
              }}
              selection={
                (myProfile.settings.visibility as string) ||
                VisibilitySettings.all
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  content: {
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'stretch',
  },
  title: {
    textAlign: 'left',
  },
  input: {
    marginVertical: 20,
  },
  notifications: {
    marginVertical: 20,
  },
  visibility: {
    marginVertical: 20,
  },
});

export default SettingsScreen;