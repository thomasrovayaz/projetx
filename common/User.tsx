import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {ProjetXUser} from '../features/user/usersTypes';
import Avatar from './Avatar';

interface ProjetXUserProps {
  friend: ProjetXUser;
}

const User: React.FC<ProjetXUserProps> = ({friend}) => {
  return (
    <View style={styles.item}>
      <Avatar key={friend.id} friend={friend} />
      <Text style={styles.title}>{friend.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    paddingVertical: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 5,
  },
});

export default User;
