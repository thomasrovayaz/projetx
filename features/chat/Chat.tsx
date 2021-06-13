import React, {useEffect, useState} from 'react';
import {
  AvatarProps,
  Bubble,
  Composer,
  ComposerProps,
  GiftedChat,
  Send,
} from 'react-native-gifted-chat';
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
import {NotificationParentType} from '../../app/onesignal';
import {nanoid} from 'nanoid';
import ImageModal from 'react-native-image-modal/src/index';
import MessageImage from 'react-native-gifted-chat/lib/MessageImage';
import FastImage from 'react-native-fast-image';

interface ChatProps {
  parent: {id: string; title: string; type: NotificationParentType};
  members: string[];
  componentId: string;
}
type OnImageChangeCallback = (event: {nativeEvent: {linkUri: string}}) => void;

const Chat: React.FC<ChatProps> = ({parent, members}) => {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const chat = useAppSelector(selectChat(parent.id));
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
                  name: users[message.user._id]?.name,
                },
              };
            }
            return message;
          })
        : [],
    );
    dispatch(chatRead(parent.id));
  }, [users, chat, parent.id, dispatch]);

  async function handleSend(newMessage: IMessage[] = []) {
    console.log(newMessage);
    for (const message of newMessage) {
      await addMessage(message, parent, members);
    }
  }

  const renderBubble = (props: BubbleProps<IMessage>) => {
    const {currentMessage, previousMessage} = props;
    if (!currentMessage) {
      return null;
    }
    const renderUsername =
      currentMessage.user &&
      currentMessage.user._id !== getMe().uid &&
      (!previousMessage ||
        !previousMessage.user ||
        currentMessage.user._id !== previousMessage.user._id);
    return (
      <View>
        {renderUsername ? (
          <Text style={styles.username}>{currentMessage.user.name}</Text>
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
            left: {
              overflow: 'hidden',
            },
            right: {
              overflow: 'hidden',
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
  const onImageChange: OnImageChangeCallback = async ({nativeEvent}) => {
    const {linkUri} = nativeEvent;
    if (linkUri) {
      const message: IMessage = {
        _id: nanoid(),
        createdAt: new Date(),
        text: '',
        user: {
          _id: getMe().uid,
        },
        image: linkUri,
      };
      await handleSend([message]);
    }
  };
  const renderMessageImage = ({
    currentMessage,
  }: MessageImage<IMessage>['props']) => {
    if (!currentMessage) {
      return null;
    }
    return (
      <View>
        <ImageModal
          resizeMode={FastImage.resizeMode.cover}
          swipeToDismiss
          modalImageResizeMode={FastImage.resizeMode.contain}
          style={styles.image}
          source={{uri: currentMessage.image}}
        />
      </View>
    );
  };
  const renderComposer = (props: ComposerProps) => (
    // @ts-ignore
    <Composer {...props} textInputProps={{onImageChange}} />
  );

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
      renderComposer={renderComposer}
      renderMessageImage={renderMessageImage}
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
  image: {width: 150, height: 100, marginBottom: 3},
});

export default Chat;
