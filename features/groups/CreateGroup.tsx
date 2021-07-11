import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import Button from '../../common/Button';
import {translate} from '../../app/locales';
import {getMyId} from '../user/usersApi';
import _ from 'lodash';
import SelectableUsersList, {
  UsersSelection,
} from '../../common/SelectableUsersList';
import {ProjetXGroup} from './groupsTypes';
import {notifyNewGroup, saveGroup} from './groupsApi';
import TextInput from '../../common/TextInput';
import {useAppSelector} from '../../app/redux';
import {selectUsers} from '../user/usersSlice';
import {BEIGE} from '../../app/colors';
import BackButton from '../../common/BackButton';
import {useNavigation} from '@react-navigation/native';
import Title from '../../common/Title';

interface CreateGroupScreenProps {
  route: {
    params?: {
      group?: ProjetXGroup;
    };
  };
}

const CreateGroupScreen: React.FC<CreateGroupScreenProps> = ({route}) => {
  let group = route?.params?.group;
  const navigation = useNavigation();
  const users = useAppSelector(selectUsers);
  const [name, setName] = useState<string>(group?.name || '');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [selectedFriends, setSelectedFriends] = useState<UsersSelection>(
    group?.users
      ? {usersSelected: Object.keys(group.users), groupsSelected: []}
      : {usersSelected: [], groupsSelected: []},
  );

  const next = async () => {
    const createMode = Boolean(!group);
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
    const me = getMyId();
    let usersToNotify: string[];
    if (members[me] === undefined) {
      members[me] = true;
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

    return createMode
      ? navigation.navigate('DetailsGroupScreen', {
          groupId: updatedGroup.id,
        })
      : navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={BEIGE} />
      <View style={styles.header}>
        <BackButton />
      </View>
      <Title style={styles.title}>
        {group
          ? translate('Mettre à jour le groupe')
          : translate('Créer un groupe')}
      </Title>
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
          title={translate(
            group ? translate('Enregistrer') : translate('Créer le groupe'),
          )}
          onPress={next}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    paddingHorizontal: 20,
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

export default CreateGroupScreen;
