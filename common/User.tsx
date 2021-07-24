import React from 'react';
import {
  StyleSheet,
  StyleProp,
  TextStyle,
  ImageStyle,
  TouchableOpacity,
} from 'react-native';
import {ProjetXUser} from '../features/user/usersTypes';
import Avatar from './Avatar';
import Text from './Text';
import {useNavigation} from '@react-navigation/native';

interface ProjetXUserProps {
  friend: ProjetXUser;
  avatarStyle?: StyleProp<ImageStyle>;
  avatarTextStyle?: StyleProp<TextStyle>;
}

const User: React.FC<ProjetXUserProps> = ({
  friend,
  avatarStyle,
  avatarTextStyle,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate('UserProfile', {userId: friend.id});
      }}
      style={styles.item}>
      <Avatar
        key={friend.id}
        friend={friend}
        style={[avatarStyle]}
        textStyle={avatarTextStyle}
      />
      <Text style={styles.title}>{friend.name}</Text>
    </TouchableOpacity>
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