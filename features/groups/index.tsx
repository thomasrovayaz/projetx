import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Title from '../../common/Title';
import {translate} from '../../app/locales';
import useTabbarIcon from '../../app/useTabbarIcon';
import {getMe} from '../user/usersApi';
import {selectMyGroups} from './groupsSlice';
import {getMyGroups} from './groupsApi';
import {ProjetXGroup} from './groupsTypes';
import Button from '../../common/Button';
import AvatarList from '../../common/AvatarList';
import {selectUsers} from '../user/usersSlice';
import {useAppSelector} from '../../app/redux';
import {
  selectTotalGroupUnreadMessageCount,
  selectUnreadMessageCount,
} from '../chat/chatsSlice';
import Badge from '../../common/Badge';

const EmptyGroupsList: React.FC = () => {
  return (
    <View style={styles.emptyList}>
      <Title style={styles.emptyText}>
        {translate(`Salut ${getMe().displayName} 👋\n`)}
      </Title>
      <Title style={styles.emptyText}>
        {translate(
          "Tu peux créer un groupe d'amis pour les inviter plus facilement",
        )}
      </Title>
    </View>
  );
};

const GroupItem: React.FC<{group: ProjetXGroup; componentId: string}> = ({
  group,
  componentId,
}) => {
  const users = useAppSelector(selectUsers);
  const unreadMessages = useAppSelector(selectUnreadMessageCount(group.id));
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        Navigation.push(componentId, {
          component: {
            name: 'DetailsGroupScreen',
            passProps: {
              groupId: group.id,
            },
          },
        })
      }
      style={styles.item}
      key={group.id}>
      <View style={styles.titleContainer}>
        <Badge count={unreadMessages} style={styles.badge} />
        <Title style={styles.groupTitle}>{group.name}</Title>
      </View>
      <AvatarList
        users={Object.keys(group.users).map(userId => users[userId])}
        emptyLabel={translate('Pas encore de membres !')}
      />
    </TouchableOpacity>
  );
};
const GroupsScreen: NavigationFunctionComponent = ({componentId}) => {
  const totalUnread = useAppSelector(selectTotalGroupUnreadMessageCount);
  useTabbarIcon(
    componentId,
    'users',
    totalUnread ? totalUnread + '' : undefined,
  );
  const groupsMap = useAppSelector(selectMyGroups);
  const [refreshing, setRefreshing] = React.useState(false);
  const [groups, setGroups] = useState<ProjetXGroup[]>([]);

  const fetchGroups = async () => {
    setRefreshing(true);
    await getMyGroups();
    setRefreshing(false);
  };
  const onRefresh = useCallback(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    fetchGroups();
  }, []);
  useEffect(() => {
    setGroups(groupsMap ? Object.values(groupsMap) : []);
  }, [groupsMap]);

  const renderItem = ({item}: {item: ProjetXGroup}) => (
    <GroupItem group={item} componentId={componentId} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <Title style={styles.title}>{translate('Mes groupes')}</Title>
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={item => item.id || ''}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={(!groups || groups.length <= 0) && styles.list}
        ListEmptyComponent={EmptyGroupsList}
      />
      <View style={styles.buttonCreate}>
        <Button
          title={translate('Créer un groupe')}
          onPress={() => {
            Navigation.push(componentId, {
              component: {
                name: 'CreateGroupScreen',
                passProps: {
                  onSave: () => {
                    onRefresh();
                    Navigation.pop(componentId);
                  },
                },
              },
            });
          }}
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
  title: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  groupTitle: {
    fontSize: 18,
    textAlign: 'left',
  },
  badge: {
    marginRight: 5,
  },
  emptyList: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  emptyIcon: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'left',
    fontSize: 18,
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 20,
  },
  buttonCreate: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

GroupsScreen.options = {
  topBar: {
    visible: false,
  },
};

export default GroupsScreen;
