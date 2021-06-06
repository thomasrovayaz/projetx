import {ProjetXEvent} from '../events/eventsTypes';
import React, {useEffect, useState} from 'react';
import {AvatarProps, Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import {IMessage} from 'react-native-gifted-chat/lib/Models';
import {getMe} from '../user/usersApi';
import {addMessage} from './chatApi';
import {useAppDispatch, useAppSelector} from '../../app/redux';
import {selectUsers} from '../user/usersSlice';
import {translate} from '../../app/locales';
import {BubbleProps} from 'react-native-gifted-chat/lib/Bubble';
import Icon from 'react-native-vector-icons/Feather';
import {SendProps} from 'react-native-gifted-chat/lib/Send';
import {StyleSheet, Text, View} from 'react-native';
import Avatar from '../../common/Avatar';
import {chatRead, selectChat} from './chatsSlice';

interface EventDetailsProps {
  event: ProjetXEvent;
  componentId: string;
}
const EventChat: React.FC<EventDetailsProps> = ({event}) => {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const chat = useAppSelector(selectChat(event.id));
  const users = useAppSelector(selectUsers);

  useEffect(() => {
    setMessages(
      chat
        ? chat.map(message => {
            if (message.user && message.user._id) {
              return {
                ...message,
                user: {
                  ...message.user,
                  name: users[message.user._id].name,
                },
              };
            }
            return message;
          })
        : [],
    );
    dispatch(chatRead(event.id));
  }, [users, chat, event.id, dispatch]);

  async function handleSend(newMessage: IMessage[] = []) {
    for (const message of newMessage) {
      await addMessage(message, event);
    }
  }

  const renderBubble = (props: BubbleProps<IMessage>) => {
    const {currentMessage, previousMessage} = props;
    const renderUsername =
      currentMessage?.user &&
      currentMessage.user._id !== getMe().uid &&
      (!previousMessage ||
        !previousMessage.user ||
        currentMessage.user._id !== previousMessage.user._id);
    return (
      <View>
        {renderUsername ? (
          <Text style={styles.username}>{currentMessage?.user.name}</Text>
        ) : null}
        <Bubble
          {...props}
          textStyle={{
            left: {
              fontFamily: 'Inter',
            },
            right: {
              fontFamily: 'Inter',
            },
          }}
          wrapperStyle={{
            left: {},
            right: {
              backgroundColor: '#473B78',
            },
          }}
        />
      </View>
    );
  };
  const renderSend = (props: SendProps<IMessage>) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <Icon name="send" size={24} color="#473B78" />
      </Send>
    );
  };
  const renderAvatar = ({currentMessage}: AvatarProps<IMessage>) => {
    if (!currentMessage) {
      return null;
    }
    const {
      user: {_id},
    } = currentMessage;
    return <Avatar friend={users[_id]} />;
  };

  return (
    <GiftedChat
      // @ts-ignore
      multiline={false}
      alwaysShowSend
      timeFormat="HH:mm"
      dateFormat="DD/MM/YYYY"
      scrollToBottom
      messages={messages}
      placeholder={translate('Écris ton message')}
      onSend={newMessage => handleSend(newMessage)}
      renderBubble={renderBubble}
      renderSend={renderSend}
      renderAvatar={renderAvatar}
      user={{
        _id: getMe().uid,
      }}
    />
  );
};

const styles = StyleSheet.create({
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 15,
  },
  username: {
    fontFamily: 'Inter',
    flex: 1,
    fontSize: 10,
    marginBottom: 2,
  },
});

export default EventChat;
