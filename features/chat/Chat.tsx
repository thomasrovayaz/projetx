import React, {useEffect, useState} from 'react';
import {
  AvatarProps,
  Bubble,
  Composer,
  ComposerProps,
  GiftedChat,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import {getMyId} from '../user/usersApi';
import {addMessage} from './chatApi';
import {useAppDispatch, useAppSelector} from '../../app/redux';
import {selectUsers} from '../user/usersSlice';
import {translate} from '../../app/locales';
import {BubbleProps} from 'react-native-gifted-chat/lib/Bubble';
import Icon from 'react-native-vector-icons/Feather';
import {SendProps} from 'react-native-gifted-chat/lib/Send';
import {StyleSheet, View, Dimensions} from 'react-native';
import Avatar from '../../common/Avatar';
import Text from '../../common/Text';
import {chatRead, selectChat} from './chatsSlice';
import {NotificationParentType} from '../../app/onesignal';
import {nanoid} from 'nanoid';
import ImageModal from 'react-native-image-modal/src/index';
import MessageImage from 'react-native-gifted-chat/lib/MessageImage';
import FastImage from 'react-native-fast-image';
import {ProjetXMessage} from './chatsTypes';
import PollPreview from '../polls/PollPreview';
import {DARK_BLUE} from '../../app/colors';

const {width} = Dimensions.get('window');

interface ChatProps {
  parent: {id: string; title: string; type: NotificationParentType};
  members: string[];
}
type OnImageChangeCallback = (event: {
  nativeEvent: {linkUri: string; mime: string};
}) => void;

const QuickRepliesPoll: React.FC<{message: ProjetXMessage}> = ({message}) => {
  if (!message.pollId) {
    return null;
  }
  return <PollPreview pollId={message.pollId} style={styles.pollContainer} />;
};

const Chat: React.FC<ChatProps> = ({parent, members}) => {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<ProjetXMessage[]>([]);
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

  async function handleSend(newMessage: ProjetXMessage[] = []) {
    for (const message of newMessage) {
      await addMessage(message, parent, members);
    }
  }

  const renderBubble = (props: BubbleProps<ProjetXMessage>) => {
    const {currentMessage, previousMessage} = props;
    if (!currentMessage) {
      return null;
    }
    const renderUsername =
      currentMessage.user &&
      currentMessage.user._id !== getMyId() &&
      (!previousMessage ||
        !previousMessage.user ||
        currentMessage.user._id !== previousMessage.user._id);
    return (
      <View
        style={[
          styles.messageContainer,
          currentMessage.pollId ? styles.pollMessageContainer : {},
        ]}>
        {renderUsername ? (
          <Text style={styles.username}>{currentMessage.user.name}</Text>
        ) : null}
        <Bubble
          {...props}
          textStyle={{
            left: {
              fontFamily: 'Montserrat Alternates',
              color: DARK_BLUE,
            },
            right: {
              fontFamily: 'Montserrat Alternates',
              color: 'white',
            },
          }}
          wrapperStyle={{
            left: {
              overflow: 'hidden',
              backgroundColor: 'white',
            },
            right: {
              overflow: 'hidden',
              backgroundColor: DARK_BLUE,
            },
          }}
        />
      </View>
    );
  };
  const renderSend = (props: SendProps<ProjetXMessage>) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <Icon name="send" size={24} color={DARK_BLUE} />
      </Send>
    );
  };
  const renderAvatar = ({currentMessage}: AvatarProps<ProjetXMessage>) => {
    if (!currentMessage) {
      return null;
    }
    const {
      user: {_id},
    } = currentMessage;
    return <Avatar friend={users[_id]} />;
  };
  const onImageChange: OnImageChangeCallback = async ({nativeEvent}) => {
    const {linkUri, mime} = nativeEvent;
    if (linkUri) {
      const message: ProjetXMessage = {
        _id: nanoid(),
        createdAt: new Date(),
        text: '',
        user: {
          _id: getMyId(),
        },
        image: linkUri,
        mime,
      };
      await handleSend([message]);
    }
  };
  const renderMessageImage = ({
    currentMessage,
  }: MessageImage<ProjetXMessage>['props']) => {
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
    <Composer
      {...props}
      // @ts-ignore
      textInputProps={{onImageChange}}
      textInputStyle={styles.textInputStyle}
      composerHeight={40}
    />
  );
  const renderInputToolbar = (props: InputToolbar['props']) => {
    return (
      <InputToolbar {...props} containerStyle={styles.textInputContainer} />
    );
  };

  const renderQuickReplies = ({
    currentMessage,
  }: {
    currentMessage: ProjetXMessage;
  }) => {
    if (currentMessage.pollId) {
      return <QuickRepliesPoll message={currentMessage} />;
    }
    return null;
  };

  return (
    <GiftedChat
      // @ts-ignore
      multiline={false}
      alwaysShowSend
      timeFormat="HH:mm"
      dateFormat="DD/MM/YYYY"
      scrollToBottom
      renderQuickReplies={renderQuickReplies}
      messages={messages}
      containerStyle={styles.containerStyle}
      placeholder={translate('Écris ton message')}
      onSend={newMessage => handleSend(newMessage)}
      renderBubble={renderBubble}
      renderSend={renderSend}
      renderAvatar={renderAvatar}
      renderComposer={renderComposer}
      maxComposerHeight={70}
      minComposerHeight={70}
      minInputToolbarHeight={70}
      renderMessageImage={renderMessageImage}
      renderInputToolbar={renderInputToolbar}
      scrollToBottomComponent={() => (
        <Icon name="arrow-down" size={20} color={DARK_BLUE} />
      )}
      scrollToBottomStyle={styles.scrollToBottomStyle}
      user={{
        _id: getMyId(),
      }}
    />
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    width: '100%',
    flex: 1,
  },
  pollMessageContainer: {
    marginTop: 20,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 15,
  },
  username: {
    flex: 1,
    fontSize: 10,
    marginBottom: 2,
  },
  image: {width: 150, height: 100, marginBottom: 3},
  scrollToBottomStyle: {borderRadius: 15, opacity: 1},
  pollContainer: {
    maxWidth: width - 20,
  },
  containerStyle: {
    borderTopWidth: 0,
  },
  textInputStyle: {
    fontFamily: 'Montserrat Alternates',
  },
  textInputContainer: {
    borderWidth: 0,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 15,
    marginTop: 10,
    borderTopColor: 'transparent',
  },
});

export default Chat;
