import {ProjetXMessage} from './chatsTypes';
import {getMyId} from '../user/usersApi';
import PollPreview from '../polls/PollPreview';
import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const ChatPoll: React.FC<{currentMessage: ProjetXMessage}> = ({
  currentMessage,
}) => {
  if (currentMessage.pollId) {
    const isMine = currentMessage.user._id === getMyId();
    return (
      <PollPreview
        pollId={currentMessage.pollId}
        style={[isMine ? styles.myPollContainer : styles.pollContainer]}
      />
    );
  }
  return null;
};

const styles = StyleSheet.create({
  pollContainer: {
    marginTop: 10,
    maxWidth: width - 65,
  },
  myPollContainer: {
    marginTop: 5,
    maxWidth: width - 20,
  },
});

export default ChatPoll;
