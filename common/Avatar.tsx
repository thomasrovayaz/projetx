import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {ProjetXUser} from '../features/user/usersTypes';

interface ProjetXAvatarProps {
  friend: ProjetXUser;
}

const Avatar: React.FC<ProjetXAvatarProps> = ({friend}) => {
  return (
    <View style={styles.avatarContainer}>
      {friend && friend.name ? (
        <Text style={styles.avatar}>{friend.name.slice(0, 2)}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#473B78',
    marginLeft: -5,
    borderColor: 'white',
    borderWidth: 1,
  },
  avatar: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
});

export default Avatar;
