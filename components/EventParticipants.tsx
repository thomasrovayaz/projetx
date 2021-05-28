import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  ViewStyle,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {ProjetXEvent} from '../api/Events';
import {getMyFriends, ProjetXUser} from '../api/Users';
import {Navigation} from 'react-native-navigation';
import {translate} from '../locales';
import Label from './Label';
import Avatar from './Avatar';

const {width} = Dimensions.get('window');

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
  moreAvatarContainer: ViewStyle;
  moreAvatar: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
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
    marginLeft: 5,
  },
  moreAvatarContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'white',
    borderColor: '#473B78',
    borderWidth: 1,
    marginLeft: -5,
  },
  moreAvatar: {
    color: '#473B78',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
});
const MAX_SIZE = (width - 40) / (40 - 5) - 1;

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

  const participants = friends
    ? friends.filter(friend =>
        ['going', 'maybe', 'notanswered'].includes(
          event.participations[friend.id],
        ),
      )
    : [];

  const showModal = () => {
    return Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: 'Participants',
              passProps: {
                event,
                friends,
              },
            },
          },
        ],
      },
    });
  };

  const moreAvatarLength = participants.length - MAX_SIZE;

  const renderAvatars = () => {
    if (refreshing) {
      return <ActivityIndicator size="large" color="#473B78" />;
    }
    if (participants.length > 0) {
      return (
        <>
          {participants &&
            participants
              .slice(0, moreAvatarLength === 1 ? MAX_SIZE + 1 : MAX_SIZE)
              .map(friend => {
                return <Avatar key={friend.id} friend={friend} />;
              })}
          {moreAvatarLength > 1 && (
            <View style={[styles.moreAvatarContainer]}>
              <Text style={[styles.moreAvatar]}>{moreAvatarLength}+</Text>
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
