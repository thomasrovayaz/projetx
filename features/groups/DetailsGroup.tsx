import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {translate} from '../../app/locales';
import {useAppSelector} from '../../app/redux';
import {selectUnreadMessageCount} from '../chat/chatsSlice';
import Tabs, {Tab} from '../../common/Tabs';
import DetailHeader from '../../common/DetailHeader';
import Chat from '../chat/Chat';
import GroupMembers from './GroupMembers';
import useTopbarButton from '../../app/useTopbarButton';
import {selectGroup} from './groupsSlice';
import GroupEvents from './GroupEvents';
import {NotificationParentType} from '../../app/onesignal';

interface CreateGroupScreenProps {
  groupId: string;
}
enum GroupTab {
  chat = 'chat',
  events = 'events',
  members = 'members',
}

const DetailsGroupScreen: NavigationFunctionComponent<CreateGroupScreenProps> =
  ({groupId, componentId}) => {
    const [tab, setTab] = useState<GroupTab>(GroupTab.events);
    const group = useAppSelector(selectGroup(groupId));
    useTopbarButton(
      componentId,
      'edit',
      'edit',
      () => {
        Navigation.push(componentId, {
          component: {
            name: 'CreateGroupScreen',
            passProps: {
              group,
              onSave: () => {
                Navigation.pop(componentId);
              },
            },
          },
        });
      },
      '#ffffff',
    );
    const unreadMessages = useAppSelector(selectUnreadMessageCount(group?.id));
    const tabs: Tab[] = [
      {id: GroupTab.events, title: translate('Événements')},
      {id: GroupTab.chat, title: translate('Messages'), badge: unreadMessages},
      {id: GroupTab.members, title: translate('Membres')},
    ];

    useEffect(() => {
      if (!group) {
        return;
      }
      Navigation.mergeOptions(componentId, {
        topBar: {
          title: {
            color: 'transparent',
            text: group.name,
          },
        },
      });
    }, [group, componentId]);

    if (!group || !group.id) {
      return null;
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
        <DetailHeader title={group.name} />
        <View style={styles.tabContainer}>
          <Tabs
            tabs={tabs}
            selectedTab={tab}
            onChangeTab={tabSelected => setTab(tabSelected as GroupTab)}
          />
        </View>
        {tab === GroupTab.events ? (
          <GroupEvents componentId={componentId} groupId={groupId} />
        ) : null}
        {tab === GroupTab.chat ? (
          <Chat
            parent={{
              id: group.id,
              title: group.name,
              type: NotificationParentType.GROUP,
            }}
            members={Object.keys(group.users)}
            componentId={componentId}
          />
        ) : null}
        {tab === GroupTab.members ? <GroupMembers groupId={group.id} /> : null}
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  content: {
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

DetailsGroupScreen.options = {
  topBar: {
    title: {
      color: 'transparent',
      text: '',
    },
    borderColor: 'transparent',
    borderHeight: 0,
    elevation: 0,
  },
  bottomTabs: {
    visible: false,
  },
};

export default DetailsGroupScreen;
