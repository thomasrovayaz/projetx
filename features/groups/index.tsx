import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Title from '../../common/Title';
import {translate} from '../../app/locales';
import {getMe} from '../user/usersApi';
import {selectMyGroups} from './groupsSlice';
import {getMyGroups} from './groupsApi';
import {ProjetXGroup} from './groupsTypes';
import AvatarList from '../../common/AvatarList';
import {selectUsers} from '../user/usersSlice';
import {useAppDispatch, useAppSelector} from '../../app/redux';
import {selectChat, selectUnreadMessageCount} from '../chat/chatsSlice';
import {useNavigation} from '@react-navigation/native';
import UnreadChip from '../../common/UnreadChip';
import {LatestMessage} from '../chat/LatestMessages';
import Text from '../../common/Text';
import Button from '../../common/Button';
import {createEvent} from '../events/eventsSlice';

const EmptyGroupsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  return (
    <View style={styles.emptyList}>
      <Image
        resizeMode={'cover'}
        style={styles.emptyImage}
        source={require('../../assets/friends.gif')}
      />
      <Text style={styles.emptyText}>
        {translate(
          'Ici tu peux créer tes groupes de potes pour organiser plus facilement tes événements\nTeam soirée 🍻 team foot ⚽️ team pain au chocolat 😏',
        )}
      </Text>
      <Button
        style={styles.emptyButton}
        icon={'calendar'}
        title={translate('Créer un évènement')}
        variant={'outlined'}
        onPress={() => {
          dispatch(createEvent());
          navigation.navigate('CreateEventType');
        }}
      />
    </View>
  );
};

const GroupItem: React.FC<{group: ProjetXGroup; componentId: string}> = ({
  group,
}) => {
  const navigation = useNavigation();
  const users = useAppSelector(selectUsers);
  const unreadMessages = useAppSelector(selectUnreadMessageCount(group.id));
  const chat = useAppSelector(selectChat(group.id || ''));
  const isUnread = unreadMessages > 0;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate('DetailsGroupScreen', {
          groupId: group.id,
          chat: isUnread,
        });
      }}
      style={styles.item}
      key={group.id}>
      {isUnread ? <UnreadChip /> : null}
      <View style={styles.itemContent}>
        <View style={styles.titleContainer}>
          <Title
            style={[styles.groupTitle, isUnread ? {fontWeight: 'bold'} : {}]}>
            {group.name}
          </Title>
        </View>
        {chat && chat.length > 0 ? (
          <View style={styles.latestMessage}>
            <LatestMessage latestMessage={chat[0]} isUnread={isUnread} />
          </View>
        ) : null}
        <AvatarList
          users={Object.keys(group.users).map(userId => users[userId])}
          emptyLabel={translate('Pas encore de membres !')}
        />
      </View>
    </TouchableOpacity>
  );
};
const GroupsScreen: React.FC = () => {
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
    <GroupItem group={item} componentId={'componentId'} />
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
        contentContainerStyle={[
          styles.content,
          (!groups || groups.length <= 0) && styles.list,
        ]}
        ListEmptyComponent={EmptyGroupsList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    paddingBottom: 100,
  },
  title: {
    marginHorizontal: 20,
    marginVertical: 10,
    marginTop: 40,
    textAlign: 'left',
  },
  titleContainer: {
    justifyContent: 'center',
    marginBottom: 5,
  },
  latestMessage: {
    marginBottom: 5,
  },
  groupTitle: {
    fontSize: 18,
    textAlign: 'left',
    fontWeight: 'normal',
  },
  badge: {
    marginRight: 5,
  },
  emptyList: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  emptyIcon: {
    marginBottom: 10,
  },
  emptyImage: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-start',
  },
  emptyButton: {},
  emptyText: {
    marginVertical: 40,
    textAlign: 'left',
    fontSize: 18,
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {},
});

export default GroupsScreen;
