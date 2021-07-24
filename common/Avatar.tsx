import React from 'react';
import {View, StyleSheet, StyleProp, TextStyle, ImageStyle} from 'react-native';
import {CachedImage} from '@georstat/react-native-image-cache';
import {ProjetXUser} from '../features/user/usersTypes';
import Text from './Text';
import {BEIGE, DARK_BLUE, LIGHT_BLUE} from '../app/colors';

interface ProjetXAvatarProps {
  friend: ProjetXUser;
  style?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
  big?: boolean;
}

const Avatar: React.FC<ProjetXAvatarProps> = ({
  friend,
  style,
  textStyle,
  big,
}) => {
  if (friend && friend.avatar && friend.avatar.small && friend.avatar.big) {
    return (
      <CachedImage
        resizeMode={'cover'}
        source={big ? friend.avatar.big : friend.avatar.small}
        style={[
          styles.avatarContainer,
          big ? styles.avatarContainerBig : {},
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatarContainer,
        big ? styles.avatarContainerBig : {},
        style,
      ]}>
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
    overflow: 'hidden',
  },
  avatarContainerBig: {
    width: 200,
    height: 200,
  },
  avatar: {
    color: DARK_BLUE,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Avatar;