import {
  SectionList,
  SectionListProps,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {translate} from '../../app/locales';
import Text from '../../common/Text';
import React from 'react';
import {ProjetXChat, selectLatestChats} from './chatsSlice';
import Icon from 'react-native-vector-icons/Feather';
import {DARK_BLUE, LIGHT_BLUE} from '../../app/colors';
import {eventTypeInfos} from '../events/eventsUtils';
import {ProjetXGroup} from '../groups/groupsTypes';
import {useAppSelector} from '../../app/redux';
import {useNavigation} from '@react-navigation/native';
import {selectUser} from '../user/usersSlice';
import UnreadChip from '../../common/UnreadChip';
import {ProjetXMessage} from './chatsTypes';

interface HomeSection {
  title: string;
  data: ProjetXChat[];
}

export const LatestMessage: React.FC<{
  latestMessage: ProjetXMessage;
  isUnread: boolean;
}> = ({latestMessage, isUnread}) => {
  const textStyle = {fontWeight: isUnread ? 'bold' : undefined};
  const author = useAppSelector(selectUser(latestMessage.user._id));
  return (
    <Text
      style={[styles.latestMessageText, textStyle]}
      numberOfLines={2}
      ellipsizeMode="tail">
      <Text style={styles.latestMessageUser}>
        {author ? author.name : translate('Un inconnu')}
      </Text>
      {` - ${latestMessage.text}`}
    </Text>
  );
};

// @ts-ignore
interface LatestMessagesProps extends SectionListProps<ProjetXChat> {
  sections?: any;
}

const LatestMessages: React.FC<LatestMessagesProps> = props => {
  const latestChats = useAppSelector(selectLatestChats);
  const navigation = useNavigation();

  const onOpenEvent = (eventId: string, chat?: boolean) => {
    navigation.navigate('Event', {eventId, chat});
  };
  const onOpenGroup = (groupToOpen: ProjetXGroup) => {
    navigation.navigate('DetailsGroupScreen', {groupId: groupToOpen.id});
  };

  const renderLatestGroupMessage = (chat: ProjetXChat) => {
    if (!chat.group) {
      return null;
    }
    const isUnread = chat.unreadMessages > 0;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => chat.group && onOpenGroup(chat.group)}
        style={[styles.item, styles.latestMessage]}
        key={chat.id}>
        {isUnread ? <UnreadChip /> : null}
        <Icon
          name={'users'}
          color={DARK_BLUE}
          style={[styles.latestMessageIcon, styles.latestGroupMessageIcon]}
        />
        <View style={styles.latestMessageInfo}>
          <Text numberOfLines={1} style={styles.latestMessageTitle}>
            {chat.group.name}
          </Text>
          <LatestMessage
            latestMessage={chat.latestMessage}
            isUnread={chat.unreadMessages > 0}
          />
        </View>
      </TouchableOpacity>
    );
  };
  const renderLatestEventMessage = (chat: ProjetXChat) => {
    if (!chat.event) {
      return null;
    }
    const eventInfos = eventTypeInfos(chat.event.type);
    const isUnread = chat.unreadMessages > 0;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => chat.event && onOpenEvent(chat.event.id, true)}
        style={[styles.item, styles.latestMessage]}
        key={chat.id}>
        {isUnread ? (
          <UnreadChip style={{backgroundColor: eventInfos.color}} />
        ) : null}
        <Text style={styles.latestMessageIcon}>{eventInfos?.emoji}</Text>
        <View style={styles.latestMessageInfo}>
          <Text numberOfLines={1} style={styles.latestMessageTitle}>
            {chat.event.title}
          </Text>
          <LatestMessage
            latestMessage={chat.latestMessage}
            isUnread={chat.unreadMessages > 0}
          />
        </View>
      </TouchableOpacity>
    );
  };
  const renderItem = ({item}: {item: ProjetXChat}) => {
    const chat = item as ProjetXChat;
    if (chat.group) {
      return renderLatestGroupMessage(chat);
    } else if (chat.event) {
      return renderLatestEventMessage(chat);
    }
    return null;
  };

  const sections: HomeSection[] =
    latestChats.length > 0
      ? [
          {
            title: translate('Derniers messages'),
            data: latestChats,
          },
        ]
      : [];

  return (
    <SectionList
      {...props}
      sections={sections}
      keyExtractor={item => item.id}
      stickySectionHeadersEnabled={false}
      renderItem={renderItem}
      renderSectionHeader={({section: {title, data}}) =>
        data.length > 0 ? (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_BLUE,
  },
  item: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  latestMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  latestMessageIcon: {
    fontSize: 40,
    marginRight: 10,
    textAlign: 'center',
  },
  latestGroupMessageIcon: {
    fontSize: 20,
    padding: 10,
    backgroundColor: LIGHT_BLUE,
    borderRadius: 15,
    overflow: 'hidden',
  },
  latestMessageInfo: {
    flexShrink: 1,
    flexDirection: 'column',
  },
  latestMessageTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  latestMessageUser: {},
  latestMessageText: {},
});

export default LatestMessages;
