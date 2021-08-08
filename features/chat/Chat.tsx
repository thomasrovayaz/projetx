import React, {useEffect, useState} from 'react';
import {GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import {getMyId} from '../user/usersApi';
import {addMessage} from './chatApi';
import {useAppDispatch, useAppSelector} from '../../app/redux';
import {selectUsers} from '../user/usersSlice';
import {translate} from '../../app/locales';
import Icon from 'react-native-vector-icons/Feather';
import {StyleSheet} from 'react-native';
import {chatRead, selectChat} from './chatsSlice';
import {NotificationParentType} from '../../app/onesignal';
import {ProjetXMessage} from './chatsTypes';
import {DARK_BLUE} from '../../app/colors';
import ActionsButton from './ActionsButton';
import ProjetXBubble from './Bubble';
import ChatAvatar from './Avatar';
import ChatPoll from './Poll';
import MessageImage from './MessageImage';
import ProjetXComposer from './Composer';
import SendButton from './SendButton';

export interface ChatProps {
  parent: {id: string; title: string; type: NotificationParentType};
  members: string[];
}

const Chat: React.FC<ChatProps> = ({parent, members}) => {
  const [limit, setLimit] = useState(2);
  const dispatch = useAppDispatch();
  const chat = useAppSelector(selectChat(parent.id, limit));
  const users = useAppSelector(selectUsers);
  const lastMessage = chat.length > 0 ? chat[0]._id : '';

  useEffect(() => {
    dispatch(chatRead(parent.id));
  }, [parent.id, dispatch, lastMessage]);

  async function handleSend(newMessage: ProjetXMessage[] = []) {
    for (const message of newMessage) {
      await addMessage(
        message,
        parent,
        members.map(userId => users[userId]),
      );
    }
  }
  const renderInputToolbar = (props: InputToolbar['props']) => {
    return (
      <InputToolbar {...props} containerStyle={styles.textInputContainer} />
    );
  };

  return (
    <GiftedChat
      // @ts-ignore
      multiline={false}
      listViewProps={{
        onEndReached: () => {
          if (limit <= chat.length) {
            setLimit(limit + 10);
          }
        },
      }}
      alwaysShowSend
      timeFormat="HH:mm"
      dateFormat="DD/MM/YYYY"
      scrollToBottom
      renderQuickReplies={({
        currentMessage,
      }: {
        currentMessage: ProjetXMessage;
      }) => <ChatPoll currentMessage={currentMessage} />}
      messages={chat}
      containerStyle={styles.containerStyle}
      placeholder={translate('Écris ton message')}
      onSend={newMessage => handleSend(newMessage)}
      renderBubble={props => <ProjetXBubble {...props} />}
      renderSend={props => <SendButton {...props} />}
      renderAvatar={props => <ChatAvatar {...props} />}
      renderComposer={props => (
        <ProjetXComposer {...props} onSend={handleSend} />
      )}
      renderActions={props => (
        <ActionsButton {...props} parent={parent} members={members} />
      )}
      maxComposerHeight={70}
      minComposerHeight={70}
      minInputToolbarHeight={70}
      renderMessageImage={({
        currentMessage,
      }: {
        currentMessage: ProjetXMessage;
      }) => <MessageImage currentMessage={currentMessage} />}
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
  scrollToBottomStyle: {borderRadius: 15, opacity: 1, borderColor: DARK_BLUE},
  containerStyle: {
    borderTopWidth: 0,
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
