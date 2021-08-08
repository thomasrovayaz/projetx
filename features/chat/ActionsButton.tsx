import React, {useState} from 'react';
import {Platform, StyleSheet} from 'react-native';
import Button from '../../common/Button';
import {translate} from '../../app/locales';
import Title from '../../common/Title';
import {useNavigation} from '@react-navigation/native';
import {DARK_BLUE, LIGHT_BLUE} from '../../app/colors';
import ProjetXModal from '../../common/Modal';
import {Actions} from 'react-native-gifted-chat';
import {ActionsProps} from 'react-native-gifted-chat/lib/Actions';
import {ChatProps} from './Chat';
import {GifSearch} from 'react-native-gif-search';
import Config from 'react-native-config';
import {INPUT_STYLE} from '../../common/TextInput';
import {addMessage} from './chatApi';
import {getMyId} from '../user/usersApi';
import {nanoid} from 'nanoid';
import {useAppSelector} from '../../app/redux';
import {selectUsers} from '../user/usersSlice';

const ActionsButton: React.FC<ActionsProps & ChatProps> = ({
  parent,
  members,
  ...props
}) => {
  const navigation = useNavigation();
  const users = useAppSelector(selectUsers);
  const [modalVisible, setModalVisible] = useState(false);
  const [showGifs, setShowGifs] = useState(false);

  const sendGif = async (gif_url: string): Promise<void> => {
    setModalVisible(false);
    setShowGifs(false);
    await addMessage(
      {
        _id: nanoid(),
        text: '',
        createdAt: new Date(),
        image: gif_url,
        mime: 'image/gif',
        user: {_id: getMyId()},
      },
      parent,
      members.map(userId => users[userId]),
    );
  };

  const renderPopupContent = () => {
    if (showGifs) {
      return (
        <GifSearch
          tenorApiKey={Config.TENOR_API_KEY}
          giphyApiKey={Config.GIPHY_API_KEY}
          gifsToLoad={10}
          maxGifsToLoad={25}
          style={styles.gifContainer}
          textInputStyle={styles.textInputStyle}
          gifListStyle={styles.gifListStyle}
          gifStyle={styles.gifStyle}
          previewGifQuality={'high'}
          selectedGifQuality={'high'}
          loadingSpinnerColor={DARK_BLUE}
          placeholderTextColor={LIGHT_BLUE}
          placeholderText={translate('Rechercher')}
          onGifSelected={sendGif}
          onGifLongPress={sendGif}
          horizontal
          showScrollBar={false}
          noGifsFoundText={translate('Pas de Gifs trouvé :(')}
          noGifsFoundTextStyle={{fontWeight: 'bold'}}
          textInputProps={{autoFocus: false}}
          onError={console.error}
        />
      );
    }
    return (
      <>
        <Title style={styles.title}>
          {translate('Que souhaites-tu ajouter ?')}
        </Title>
        <Button
          style={styles.button}
          icon={'check-square'}
          variant={'outlined'}
          title={translate('Créer un sondage')}
          onPress={() => {
            setModalVisible(false);
            navigation.navigate('CreatePoll', {
              parentId: parent.id,
              parentTitle: parent.title,
              usersToNotify: members,
            });
          }}
        />
        <Button
          style={styles.button}
          icon={'image'}
          variant={'outlined'}
          title={translate('Ajouter un GIF')}
          onPress={() => {
            setShowGifs(true);
          }}
        />
      </>
    );
  };

  return (
    <>
      <Actions
        {...props}
        containerStyle={styles.actionsContainer}
        wrapperStyle={styles.actionWrapper}
        iconTextStyle={styles.actionIcon}
        onPressActionButton={() => setModalVisible(true)}
      />
      <ProjetXModal
        height={showGifs ? 350 : 300}
        open={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setShowGifs(false);
        }}>
        {renderPopupContent()}
      </ProjetXModal>
    </>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    ...Platform.select({
      ios: {
        top: -2.5,
      },
      android: {},
    }),
  },
  actionWrapper: {
    borderColor: DARK_BLUE,
    borderRadius: 10,
  },
  actionIcon: {color: DARK_BLUE},
  title: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 20,
  },
  gifContainer: {backgroundColor: 'white'},
  textInputStyle: {
    ...INPUT_STYLE,
    fontSize: 14,
    fontWeight: '600',
    color: DARK_BLUE,
    marginHorizontal: 0,
  },
  gifListStyle: {flexGrow: 0, marginVertical: 20},
  gifStyle: {borderWidth: 0, borderRadius: 15, height: 150, overflow: 'hidden'},
});

export default ActionsButton;
