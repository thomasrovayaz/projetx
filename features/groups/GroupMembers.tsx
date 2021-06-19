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
import Button from '../../common/Button';
import IconButton from '../../common/IconButton';
import {Navigation} from 'react-native-navigation';
import {ShareGroup} from './groupsUtils';

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

  if (!group) {
    return null;
  }
  const share = async () => ShareGroup(group);
  const qrCode = async () =>
    Navigation.showModal({
      component: {
        name: 'QRCode',
        passProps: {
          link: group.shareLink,
        },
      },
    });

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
        <View style={styles.ctas}>
          <Button
            style={[styles.cta, styles.ctaLeft]}
            title={translate('Partager')}
            onPress={share}
          />
          <IconButton
            style={styles.qrcodeButton}
            name="maximize"
            onPress={qrCode}
            size={20}
          />
        </View>
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
  ctas: {
    paddingVertical: 10,
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
  ctaMiddle: {
    flex: 1,
    marginHorizontal: 5,
  },
  qrcodeButton: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#E6941B',
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GroupMembers;
