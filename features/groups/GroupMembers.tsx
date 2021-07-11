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
import Button from '../../common/Button';
import {ProjetXUser} from '../user/usersTypes';
import {getMyId, getUsers} from '../user/usersApi';
import {filterWithFuse} from '../../app/fuse';
import {useAppSelector} from '../../app/redux';
import User from '../../common/User';
import {useNavigation} from '@react-navigation/native';
import {BEIGE, DARK_BLUE} from '../../app/colors';
import {selectGroup} from './groupsSlice';
import {getGroup} from './groupsApi';
import {useSelector} from 'react-redux';
import {selectMyFriends} from '../user/usersSlice';
import {ShareGroup} from './groupsUtils';
import IconButton from '../../common/IconButton';
import Icon from 'react-native-vector-icons/Ionicons';
import QRCodeButton from '../../common/QRCodeButton';

interface ProjetXGroupMembersProps {
  route: {
    params: {
      groupId: string;
    };
  };
}

const GroupMembersModal: React.FC<ProjetXGroupMembersProps> = ({route}) => {
  const {groupId} = route.params;
  const friends = useSelector(selectMyFriends);
  const navigation = useNavigation();
  const group = useAppSelector(selectGroup(groupId));
  const [searchText, onChangeSearchText] = useState<string>('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [members, setMembers] = useState<ProjetXUser[]>([]);
  const onRefresh = useCallback(() => {
    const fetchUsers = async () => {
      setRefreshing(true);
      await Promise.all([getUsers(), getGroup(groupId)]);
      setRefreshing(false);
    };
    fetchUsers();
  }, [groupId]);

  useEffect(() => {
    if (!friends || !group) {
      return;
    }
    setMembers(
      filterWithFuse(
        friends.filter(friend => group.users[friend.id]),
        ['name'],
        searchText,
      ),
    );
  }, [friends, group, searchText]);

  if (!group) {
    return null;
  }
  const share = async () => ShareGroup(group);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={BEIGE} />
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
        <View style={styles.buttons}>
          <Button
            title={translate('Inviter')}
            style={[styles.cta, styles.ctaLeft]}
            onPress={share}
          />
          <QRCodeButton
            link={group.shareLink}
            title={`${translate('Scan ce QR code pour rejoindre le groupe')} "${
              group.name
            }"`}
          />
          <Button
            style={[styles.cta, styles.ctaRight]}
            variant="outlined"
            title={translate('Fermer')}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
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
  },
  searchInput: {
    paddingBottom: 0,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 5,
    backgroundColor: BEIGE,
  },
  headerIcon: {
    marginRight: 5,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_BLUE,
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
  },
  cta: {
    flex: 1,
  },
  ctaLeft: {
    marginRight: 10,
  },
  ctaRight: {
    marginLeft: 10,
  },
});

export default GroupMembersModal;
