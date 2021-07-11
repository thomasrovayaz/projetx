import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, TextStyle} from 'react-native';
import {ProjetXUser} from '../features/user/usersTypes';
import Avatar from './Avatar';
import Text from './Text';

interface ProjetXUserProps {
  friend: ProjetXUser;
  avatarStyle?: StyleProp<ViewStyle>;
  avatarTextStyle?: StyleProp<TextStyle>;
}

const User: React.FC<ProjetXUserProps> = ({
  friend,
  avatarStyle,
  avatarTextStyle,
}) => {
  return (
    <View style={styles.item}>
      <Avatar
        key={friend.id}
        friend={friend}
        style={[avatarStyle]}
        textStyle={avatarTextStyle}
      />
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
