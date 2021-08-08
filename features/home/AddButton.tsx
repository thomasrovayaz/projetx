import React, {useState} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import IconButton from '../../common/IconButton';
import Button from '../../common/Button';
import {translate} from '../../app/locales';
import Title from '../../common/Title';
import {useNavigation} from '@react-navigation/native';
import {createEvent} from '../events/eventsSlice';
import {useAppDispatch} from '../../app/redux';
import {DARK_BLUE} from '../../app/colors';
import ProjetXModal from '../../common/Modal';

const AddButton: React.FC<{style?: ViewStyle}> = ({style}) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <IconButton
        name={'plus'}
        color={DARK_BLUE}
        size={40}
        onPress={() => setModalVisible(true)}
        style={[style]}
      />
      <ProjetXModal
        height={300}
        open={modalVisible}
        onClose={() => setModalVisible(false)}>
        <Title style={styles.title}>
          {translate('Que souhaites-tu créer ?')}
        </Title>
        <Button
          style={styles.button}
          icon={'calendar'}
          title={translate('Créer un évènement')}
          variant={'outlined'}
          onPress={() => {
            setModalVisible(false);
            dispatch(createEvent({}));
            navigation.navigate('CreateEventType');
          }}
        />
        <Button
          style={styles.button}
          icon={'users'}
          title={translate('Créer un groupe de pote')}
          variant={'outlined'}
          onPress={() => {
            setModalVisible(false);
            navigation.navigate('CreateGroupScreen');
          }}
        />
      </ProjetXModal>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 20,
  },
});

export default AddButton;
