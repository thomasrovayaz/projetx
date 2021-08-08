import {AvatarProps} from 'react-native-gifted-chat';
import {ProjetXMessage} from './chatsTypes';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Avatar from '../../common/Avatar';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../../app/redux';
import {selectUsers} from '../user/usersSlice';

const ChatAvatar: React.FC<AvatarProps<ProjetXMessage>> = ({
  currentMessage,
}) => {
  const navigation = useNavigation();
  const users = useAppSelector(selectUsers);

  if (!currentMessage) {
    return null;
  }
  const {
    user: {_id},
  } = currentMessage;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('UserProfile', {userId: _id})}>
      <Avatar style={styles.avatar} friend={users[_id]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginLeft: 0,
  },
});

export default ChatAvatar;
