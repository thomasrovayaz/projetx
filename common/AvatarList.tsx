import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StyleProp,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {ProjetXUser} from '../features/user/usersTypes';
import Avatar from './Avatar';
import Text from './Text';
import {BORDER_COLOR, DARK_BLUE} from '../app/colors';

interface ProjetXAvatarProps {
  users: ProjetXUser[];
  emptyLabel: string;
  renderBadge?(user: ProjetXUser): Element;
  avatarStyle?: StyleProp<ImageStyle>;
  avatarTextStyle?: StyleProp<TextStyle>;
}
const {width} = Dimensions.get('window');
const MAX_SIZE = Math.floor((width - 40) / (40 - 5) - 1);

const AvatarList: React.FC<ProjetXAvatarProps> = ({
  users,
  renderBadge,
  emptyLabel,
  avatarStyle,
  avatarTextStyle,
}) => {
  const moreAvatarLength = users.length - MAX_SIZE;

  if (users.length > 0) {
    return (
      <View style={styles.content}>
        {users &&
          users
            .slice(0, moreAvatarLength === 1 ? MAX_SIZE + 1 : MAX_SIZE)
            .map(user => {
              if (!user) {
                return null;
              }
              return (
                <View key={user.id} style={styles.avatarContainer}>
                  <Avatar
                    friend={user}
                    style={[styles.avatar, avatarStyle]}
                    textStyle={avatarTextStyle}
                  />
                  {renderBadge ? renderBadge(user) : null}
                </View>
              );
            })}
        {moreAvatarLength > 1 && (
          <View style={[styles.moreAvatarContainer]}>
            <Text style={[styles.moreAvatar]}>{moreAvatarLength}+</Text>
          </View>
        )}
      </View>
    );
  }
  return <Text style={styles.emptyText}>{emptyLabel}</Text>;
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 5,
  },
  avatarContainer: {},
  avatar: {
    borderColor: 'white',
  },
  moreAvatarContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'white',
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    marginLeft: -5,
  },
  moreAvatar: {
    color: DARK_BLUE,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {},
});

export default AvatarList;
