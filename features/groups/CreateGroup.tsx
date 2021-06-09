import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../../common/Button';
import {translate} from '../../app/locales';
import {getMe} from '../user/usersApi';
import _ from 'lodash';
import SelectableUsersList from '../../common/SelectableUsersList';
import {ProjetXGroup} from './groupsTypes';
import {saveGroup} from './groupsApi';
import TextInput from '../../common/TextInput';

interface CreateGroupScreenProps {
  onSave(newGroup: ProjetXGroup): void;
  group?: ProjetXGroup;
}

const CreateGroupScreen: NavigationFunctionComponent<CreateGroupScreenProps> =
  ({onSave, group}) => {
    const [name, setName] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [selectedFriends, setSelectedFriends] = useState<string[]>(
      group?.users ? Object.keys(group.users) : [],
    );

    const next = async () => {
      if (!name || name === '') {
        setSubmitted(true);
        return;
      }
      let users: {[userId: string]: boolean} = {};
      for (const selectedFriend of selectedFriends) {
        if (group?.users[selectedFriend] === undefined) {
          users[selectedFriend] = true;
        } else {
          users[selectedFriend] = group.users[selectedFriend];
        }
      }
      const me = getMe();
      if (users[me.uid] === undefined) {
        users[me.uid] = true;
      }
      if (group) {
        const newUsers = _.difference(
          Object.keys(users),
          Object.keys(group.users),
        );
        console.log('newUsers', newUsers);
        group.name = name;
        group.users = users;
      } else {
        group = {name, users};
      }
      await saveGroup({...group});
      return onSave(group);
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
        <View style={styles.input}>
          <TextInput
            label={translate('Nom du groupe')}
            error={
              submitted && (!name || name === '')
                ? translate("J'ai besoin d'un nom de groupe")
                : undefined
            }
            value={name}
            onChangeText={setName}
            returnKeyType="done"
            placeholder={translate('Les jacky tunning')}
          />
        </View>
        <SelectableUsersList
          label={translate('Membres')}
          selection={selectedFriends}
          onChange={setSelectedFriends}
        />
        <View style={styles.buttonNext}>
          <Button
            title={translate(group ? 'Enregistrer' : 'Créer')}
            onPress={next}
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
  input: {
    paddingTop: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  buttonNext: {
    padding: 20,
  },
});

CreateGroupScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: translate('Groupe'),
    },
  },
  bottomTabs: {
    visible: false,
  },
};

export default CreateGroupScreen;
