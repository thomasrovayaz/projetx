import React, {useState} from 'react';
import {useAppSelector} from '../../app/redux';
import {selectUser} from './usersSlice';
import {getMyId, updateProfilePic} from './usersApi';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {showToast} from '../../common/Toast';
import {translate} from '../../app/locales';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {DARK_BLUE, LIGHT_BLUE} from '../../app/colors';
import Avatar from '../../common/Avatar';
import ProjetXModal from '../../common/Modal';
import Title from '../../common/Title';
import Button from '../../common/Button';
import {createEvent} from '../events/eventsSlice';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';

const AvatarEditor = () => {
  const [updating, setUpdating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const myProfile = useAppSelector(selectUser(getMyId()));

  const selectPicCallback = async (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      try {
        setUpdating(true);
        await updateProfilePic(response.assets[0].uri);
        setUpdating(false);
      } catch (e) {
        console.error(e);
        showToast({
          message: translate("J'arrive pas à changer ton image ☹️"),
        });
      }
    }
  };
  const openImageLibrary = async () => {
    launchImageLibrary({mediaType: 'photo'}, selectPicCallback);
  };
  const openCamera = async () => {
    launchCamera({mediaType: 'photo', cameraType: 'front'}, selectPicCallback);
  };

  if (updating) {
    return (
      <View style={styles.avatar}>
        <ActivityIndicator color={DARK_BLUE} size="large" />
      </View>
    );
  }
  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}>
        <Avatar
          big
          friend={myProfile}
          style={styles.avatar}
          textStyle={styles.avatarText}
        />
      </TouchableOpacity>
      <ProjetXModal
        height={300}
        open={modalVisible}
        onClose={() => setModalVisible(false)}>
        <Title style={styles.title}>{translate('Changer de photo')}</Title>
        <Button
          style={styles.button}
          icon={'camera'}
          title={translate('Prendre un selfie')}
          variant={'outlined'}
          onPress={() => {
            openCamera();
            setModalVisible(false);
          }}
        />
        <Button
          style={styles.button}
          icon={'image'}
          title={translate('Chercher dans mes photos')}
          variant={'outlined'}
          onPress={() => {
            openImageLibrary();
            setModalVisible(false);
          }}
        />
      </ProjetXModal>
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 200,
    height: 200,
    borderColor: 'white',
    backgroundColor: LIGHT_BLUE,
    marginVertical: 20,
    marginLeft: -5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 30,
  },
  title: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 20,
  },
});

export default AvatarEditor;