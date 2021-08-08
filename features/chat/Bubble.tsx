import {BubbleProps} from 'react-native-gifted-chat/lib/Bubble';
import {ProjetXMessage} from './chatsTypes';
import {getMyId} from '../user/usersApi';
import {StyleSheet, View} from 'react-native';
import Text from '../../common/Text';
import {Bubble} from 'react-native-gifted-chat';
import {DARK_BLUE} from '../../app/colors';
import React from 'react';
import {useAppSelector} from '../../app/redux';
import {selectUsers} from '../user/usersSlice';

const ProjetXBubble: React.FC<BubbleProps<ProjetXMessage>> = props => {
  const {currentMessage, previousMessage} = props;
  const users = useAppSelector(selectUsers);
  if (!currentMessage) {
    return null;
  }
  const user = users[currentMessage.user._id];
  const renderUsername =
    user &&
    user.id !== getMyId() &&
    (!previousMessage ||
      !previousMessage.user ||
      user.id !== previousMessage.user._id);
  return (
    <View
      style={[
        styles.messageContainer,
        currentMessage.pollId ? styles.pollMessageContainer : {},
      ]}>
      {renderUsername ? <Text style={styles.username}>{user.name}</Text> : null}
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

const styles = StyleSheet.create({
  messageContainer: {
    width: '100%',
    flex: 1,
  },
  username: {
    flex: 1,
    fontSize: 10,
    marginBottom: 2,
  },
  pollMessageContainer: {
    marginTop: 20,
  },
});

export default ProjetXBubble;
