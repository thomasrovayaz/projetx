import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  ViewStyle,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {ProjetXEvent} from '../api/Events';
import {getMyFriends, ProjetXUser} from '../api/Users';
import {Navigation} from 'react-native-navigation';
import {translate} from '../locales';
import Label from './Label';

interface ProjetXEventParticipantsProps {
  event: ProjetXEvent;
  withLabel?: boolean;
  hideOnEmpty?: boolean;
  style?: ViewStyle;
}

interface Style {
  container: ViewStyle;
  label: ViewStyle;
  content: ViewStyle;
  avatarContainer: ViewStyle;
  avatar: ViewStyle;
  moreAvatarContainer: ViewStyle;
  moreAvatar: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 50,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
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
  moreAvatarContainer: {
    backgroundColor: 'white',
    borderColor: '#473B78',
  },
  moreAvatar: {
    color: '#473B78',
  },
});
const MAX_SIZE = 2;

const EventParticipants: React.FC<ProjetXEventParticipantsProps> = ({
  event,
  withLabel,
  hideOnEmpty,
  style,
}) => {
  const [friends, setFriends] = useState<ProjetXUser[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchFriends = async () => {
    setRefreshing(true);
    setFriends(await getMyFriends());
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const showModal = () => {
    return Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: 'Participants',
            },
          },
        ],
      },
    });
  };

  const participants = friends
    ? friends.filter(friend =>
        ['going', 'maybe', 'notanswered'].includes(
          event.participations[friend.id],
        ),
      )
    : [];

  const moreAvatarLength = participants.length - MAX_SIZE;

  const renderAvatars = () => {
    if (refreshing) {
      return <ActivityIndicator size="large" color="#473B78" />;
    }
    if (participants.length > 0) {
      return (
        <>
          {participants &&
            participants.slice(0, MAX_SIZE).map(friend => {
              return (
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatar}>{friend.name.slice(0, 2)}</Text>
                </View>
              );
            })}
          {moreAvatarLength > 0 && (
            <View style={[styles.avatarContainer, styles.moreAvatarContainer]}>
              <Text style={[styles.avatar, styles.moreAvatar]}>
                {moreAvatarLength}+
              </Text>
            </View>
          )}
        </>
      );
    }
    return (
      <Text>{translate('Pas encore de participant, soit le premier !')}</Text>
    );
  };
  if (hideOnEmpty && participants.length === 0) {
    return null;
  }
  return (
    <TouchableOpacity onPress={showModal} style={[styles.container, style]}>
      {withLabel && <Label>{translate('Participants')}</Label>}
      <View style={styles.content}>{renderAvatars()}</View>
    </TouchableOpacity>
  );
};

export default EventParticipants;
