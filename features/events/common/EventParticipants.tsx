import React from 'react';
import {
  StyleSheet,
  Text,
  ViewStyle,
  View,
  TouchableOpacity,
  Dimensions,
  TextStyle,
} from 'react-native';
import {EventParticipation, ProjetXEvent} from '../eventsTypes';
import {Navigation} from 'react-native-navigation';
import {translate} from '../../../app/locales';
import Label from '../../../common/Label';
import Avatar from '../../../common/Avatar';
import {useSelector} from 'react-redux';
import {selectMyFriends} from '../../user/usersSlice';
import Icon from 'react-native-vector-icons/Feather';
import Button from '../../../common/Button';
import {openEvent} from '../eventsSlice';
import {useAppDispatch} from '../../../app/redux';

const {width} = Dimensions.get('window');

interface ProjetXEventParticipantsProps {
  event: ProjetXEvent;
  componentId: string;
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
  emptyText: TextStyle;
  avatarContainer: ViewStyle;
  avatarStatusIconContainer: ViewStyle;
  avatarStatusIcon: ViewStyle;
  button: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 20,
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
  avatarContainer: {},
  avatarStatusIconContainer: {
    position: 'absolute',
    bottom: -4,
    right: 0,
    borderRadius: 15,
    borderColor: '#473B78',
    overflow: 'hidden',
  },
  avatarStatusIcon: {
    backgroundColor: 'white',
    padding: 2,
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
  emptyText: {
    marginLeft: -5,
  },
  button: {
    marginBottom: 20,
  },
});
const MAX_SIZE = Math.floor((width - 40) / (40 - 5) - 1);

const participationToIcon = {
  [EventParticipation.going]: 'thumbs-up',
  [EventParticipation.notgoing]: 'thumbs-down',
  [EventParticipation.maybe]: 'meh',
  [EventParticipation.notanswered]: 'clock',
};

const EventParticipants: React.FC<ProjetXEventParticipantsProps> = ({
  event,
  withLabel,
  hideOnEmpty,
  style,
  componentId,
}) => {
  const dispatch = useAppDispatch();
  const friends = useSelector(selectMyFriends);
  const participants = friends
    ? friends.filter(friend =>
        [
          EventParticipation.going,
          EventParticipation.maybe,
          EventParticipation.notanswered,
        ].includes(event.participations[friend.id]),
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
                eventId: event.id,
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
    if (participants.length > 0) {
      return (
        <>
          {participants &&
            participants
              .slice(0, moreAvatarLength === 1 ? MAX_SIZE + 1 : MAX_SIZE)
              .map(friend => {
                return (
                  <View key={friend.id} style={styles.avatarContainer}>
                    <Avatar friend={friend} />
                    <View style={styles.avatarStatusIconContainer}>
                      <Icon
                        style={styles.avatarStatusIcon}
                        color="#473B78"
                        size={13}
                        name={
                          participationToIcon[event.participations[friend.id]]
                        }
                      />
                    </View>
                  </View>
                );
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
      <Text style={styles.emptyText}>
        {translate('Pas encore de participant, soit le premier !')}
      </Text>
    );
  };
  if (hideOnEmpty && participants.length === 0) {
    return null;
  }
  if (participants.length === 0 && event.isAuthor()) {
    return (
      <Button
        style={styles.button}
        title={translate('Inviter des amis')}
        variant="outlined"
        onPress={() => {
          dispatch(openEvent(event));
          Navigation.push(componentId, {
            component: {
              name: 'CreateEventWho',
              passProps: {
                onSave: async () => {
                  await Navigation.pop(componentId);
                },
              },
            },
          });
        }}
      />
    );
  }
  return (
    <TouchableOpacity
      onPress={showModal}
      activeOpacity={0.8}
      style={[styles.container, style]}>
      {withLabel && <Label>{translate('Participants')}</Label>}
      <View style={styles.content}>{renderAvatars()}</View>
    </TouchableOpacity>
  );
};

export default EventParticipants;
