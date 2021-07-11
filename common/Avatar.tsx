import React from 'react';
import {View, StyleSheet, ViewStyle, StyleProp, TextStyle} from 'react-native';
import {ProjetXUser} from '../features/user/usersTypes';
import Text from './Text';
import {BEIGE, DARK_BLUE, LIGHT_BLUE} from '../app/colors';

interface ProjetXAvatarProps {
  friend: ProjetXUser;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Avatar: React.FC<ProjetXAvatarProps> = ({friend, style, textStyle}) => {
  return (
    <View style={[styles.avatarContainer, style]}>
      {friend && friend.name ? (
        <Text style={[styles.avatar, textStyle]}>
          {friend.name.slice(0, 2)}
        </Text>
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
    backgroundColor: LIGHT_BLUE,
    marginLeft: -5,
    borderColor: BEIGE,
    borderWidth: 1,
  },
  avatar: {
    color: DARK_BLUE,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Avatar;
