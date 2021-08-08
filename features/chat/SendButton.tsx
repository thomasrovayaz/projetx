import {SendProps} from 'react-native-gifted-chat/lib/Send';
import {ProjetXMessage} from './chatsTypes';
import {Send} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Feather';
import {DARK_BLUE} from '../../app/colors';
import React from 'react';
import {StyleSheet} from 'react-native';

const SendButton: React.FC<SendProps<ProjetXMessage>> = props => {
  return (
    <Send {...props} containerStyle={styles.container}>
      <Icon name="send" size={24} color={DARK_BLUE} />
    </Send>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 15,
  },
});

export default SendButton;
