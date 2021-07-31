import React, {useRef} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {PollType, ProjetXPoll} from './pollsTypes';
import {createPoll} from './pollsApi';
import {useNavigation} from '@react-navigation/native';
import {sendPollMessage} from './pollsUtils';
import {BEIGE} from '../../app/colors';
import PollEditor from './PollEditor';
import {useAppSelector} from '../../app/redux';
import {selectUsers} from '../user/usersSlice';

interface CreatePollModalProps {
  route: {
    params: {
      type?: PollType;
      parentId: string;
      parentTitle: string;
      usersToNotify?: string[];
    };
  };
}

const CreatePollModal: React.FC<CreatePollModalProps> = ({
  route: {
    params: {type = PollType.OTHER, parentId, parentTitle, usersToNotify},
  },
}) => {
  const navigation = useNavigation();
  const users = useAppSelector(selectUsers);
  const currentPoll = useRef(createPoll(type, parentId));

  const save = async (poll: ProjetXPoll) => {
    if (usersToNotify) {
      await sendPollMessage(
        poll,
        parentId,
        parentTitle,
        usersToNotify.map(userId => users[userId]),
      );
    }
    navigation.goBack();
    navigation.goBack();
  };
  const cancel = async () => {
    navigation.goBack();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <PollEditor poll={currentPoll.current} onSave={save} onCancel={cancel} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BEIGE,
  },
});

export default CreatePollModal;