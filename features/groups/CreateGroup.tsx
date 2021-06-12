import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../../common/Button';
import {translate} from '../../app/locales';
import {getMe} from '../user/usersApi';
import _ from 'lodash';
import SelectableUsersList, {
  UsersSelection,
} from '../../common/SelectableUsersList';
import {ProjetXGroup} from './groupsTypes';
import {notifyNewGroup, saveGroup} from './groupsApi';
import TextInput from '../../common/TextInput';
import {useAppSelector} from '../../app/redux';
import {selectUsers} from '../user/usersSlice';

interface CreateGroupScreenProps {
  onSave(newGroup: ProjetXGroup): void;
  group?: ProjetXGroup;
}

const CreateGroupScreen: NavigationFunctionComponent<CreateGroupScreenProps> =
  ({onSave, group}) => {
    const users = useAppSelector(selectUsers);
    const [name, setName] = useState<string>(group?.name || '');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [selectedFriends, setSelectedFriends] = useState<UsersSelection>(
      group?.users
        ? {usersSelected: Object.keys(group.users), groupsSelected: []}
        : {usersSelected: [], groupsSelected: []},
    );

    const next = async () => {
      if (!name || name === '') {
        setSubmitted(true);
        return;
      }
      let members: {[userId: string]: boolean} = {};
      for (const selectedFriend of selectedFriends.usersSelected) {
        if (group?.users[selectedFriend] === undefined) {
          members[selectedFriend] = true;
        } else {
          members[selectedFriend] = group.users[selectedFriend];
        }
      }
      const me = getMe();
      let usersToNotify: string[];
      if (members[me.uid] === undefined) {
        members[me.uid] = true;
      }
      if (group) {
        usersToNotify = _.difference(
          Object.keys(members),
          Object.keys(group.users),
        );
        group.name = name;
        group.users = members;
      } else {
        usersToNotify = Object.keys(members);
        group = {name, users: members};
      }

      const updatedGroup = await saveGroup({...group});
      notifyNewGroup(
        updatedGroup,
        Object.values(users).filter(user => usersToNotify.includes(user.id)),
      );

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
            placeholder={translate('Team foot')}
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
      text: translate('Créé un groupe'),
    },
  },
  bottomTabs: {
    visible: false,
  },
};

export default CreateGroupScreen;
