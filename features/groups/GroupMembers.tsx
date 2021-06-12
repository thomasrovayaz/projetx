import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {translate} from '../../app/locales';
import TextInput from '../../common/TextInput';
import {ProjetXUser} from '../user/usersTypes';
import {getUsers} from '../user/usersApi';
import {filterWithFuse} from '../../app/fuse';
import {useAppSelector} from '../../app/redux';
import User from '../../common/User';
import {selectGroup} from './groupsSlice';
import {selectUsers} from '../user/usersSlice';
import {getGroup} from './groupsApi';

interface ProjetXEventParticipantsProps {
  groupId: string;
}

const GroupMembers: React.FC<ProjetXEventParticipantsProps> = ({groupId}) => {
  const group = useAppSelector(selectGroup(groupId));
  const users = useAppSelector(selectUsers);
  const [searchText, onChangeSearchText] = useState<string>('');
  const [members, setMembers] = useState<ProjetXUser[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = useCallback(() => {
    const fetchUsers = async () => {
      setRefreshing(true);
      await Promise.all([getUsers(), getGroup(groupId)]);
      setRefreshing(false);
    };
    fetchUsers();
  }, [groupId]);

  useEffect(() => {
    if (!users || !group) {
      return;
    }
    setMembers(
      filterWithFuse<ProjetXUser>(
        Object.values(users).filter(user => group.users[user.id]),
        ['name'],
        searchText,
      ),
    );
  }, [users, group, searchText]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
      <View style={styles.content}>
        <View style={styles.searchInput}>
          <TextInput
            value={searchText}
            onChangeText={onChangeSearchText}
            placeholder={translate('Rechercher...')}
          />
        </View>
        <FlatList
          data={members}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({item}) => <User friend={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchInput: {
    paddingBottom: 0,
    justifyContent: 'center',
  },
});

export default GroupMembers;
