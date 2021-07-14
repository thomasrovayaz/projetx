import React, {useEffect, useState} from 'react';
import {Alert, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {translate} from '../../app/locales';
import {useAppSelector} from '../../app/redux';
import {selectUnreadMessageCount} from '../chat/chatsSlice';
import Tabs, {Tab} from '../../common/Tabs';
import DetailHeader from '../../common/DetailHeader';
import Chat from '../chat/Chat';
import {selectGroup} from './groupsSlice';
import GroupEvents from './GroupEvents';
import {NotificationParentType} from '../../app/onesignal';
import {BEIGE, DARK_BLUE, RED} from '../../app/colors';
import {useNavigation} from '@react-navigation/native';
import {getGroup, removeGroup} from './groupsApi';
import {getUsers} from '../user/usersApi';

interface CreateGroupScreenProps {
  route: {
    params: {
      groupId: string;
      chat?: boolean;
    };
  };
}
enum GroupTab {
  chat = 'chat',
  events = 'events',
}

const DetailsGroupScreen: React.FC<CreateGroupScreenProps> = ({
  route: {
    params: {groupId, chat},
  },
}) => {
  const navigation = useNavigation();
  const [tab, setTab] = useState<GroupTab>(
    chat ? GroupTab.chat : GroupTab.events,
  );
  const group = useAppSelector(selectGroup(groupId));

  useEffect(() => {
    getGroup(groupId);
    getUsers();
  }, [groupId, tab]);

  const openParticipants = () => {
    if (!group) {
      return;
    }
    navigation.navigate('GroupMembers', {groupId: group.id});
  };
  const edit = () => {
    navigation.navigate('CreateGroupScreen', {
      group,
    });
  };
  const remove = () => {
    if (!group) {
      return;
    }
    Alert.alert(translate('Supprimer le groupe'), translate('Es-tu sûr?'), [
      {
        text: translate('Non'),
        style: 'cancel',
      },
      {text: translate('Oui'), onPress: () => removeGroup(group)},
    ]);
  };
  const unreadMessages = useAppSelector(selectUnreadMessageCount(group?.id));
  const tabs: Tab[] = [
    {id: GroupTab.events, title: translate('Événements')},
    {id: GroupTab.chat, title: translate('Messages'), badge: unreadMessages},
  ];

  if (!group || !group.id) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={BEIGE} />
      <DetailHeader
        title={group.name}
        small
        actions={[
          {
            icon: 'users',
            color: DARK_BLUE,
            onPress: openParticipants,
          },
          {icon: 'edit', color: DARK_BLUE, onPress: edit},
          {icon: 'trash', color: RED, onPress: remove},
        ]}
      />
      <View style={styles.tabContainer}>
        <Tabs
          tabs={tabs}
          selectedTab={tab}
          onChangeTab={tabSelected => setTab(tabSelected as GroupTab)}
        />
      </View>
      {tab === GroupTab.events ? <GroupEvents groupId={groupId} /> : null}
      {tab === GroupTab.chat ? (
        <Chat
          parent={{
            id: group.id,
            title: group.name,
            type: NotificationParentType.GROUP,
          }}
          members={Object.keys(group.users)}
        />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  content: {
    flex: 1,
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

export default DetailsGroupScreen;
