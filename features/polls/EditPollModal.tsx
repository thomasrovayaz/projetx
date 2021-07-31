import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {ProjetXPoll} from './pollsTypes';
import {useNavigation} from '@react-navigation/native';
import {BEIGE} from '../../app/colors';
import PollEditor from './PollEditor';
import {useAppSelector} from '../../app/redux';
import {selectPoll} from './pollsSlice';

interface EditPollModalProps {
  route: {
    params: {
      pollId: string;
    };
  };
}

const EditPollModal: React.FC<EditPollModalProps> = ({
  route: {
    params: {pollId},
  },
}) => {
  const navigation = useNavigation();
  const poll = useAppSelector(selectPoll(pollId));

  const save = async () => {
    navigation.goBack();
  };
  const cancel = async () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <PollEditor poll={poll} onSave={save} onCancel={cancel} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BEIGE,
  },
});

export default EditPollModal;