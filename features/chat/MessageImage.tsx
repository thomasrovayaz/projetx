import {MessageImageProps} from 'react-native-gifted-chat/lib/MessageImage';
import {ProjetXMessage} from './chatsTypes';
import {StyleSheet, View} from 'react-native';
import ImageModal from 'react-native-image-modal/src/index';
import FastImage from 'react-native-fast-image';
import React from 'react';

const MessageImage: React.FC<MessageImageProps<ProjetXMessage>> = ({
  currentMessage,
}) => {
  if (!currentMessage) {
    return null;
  }
  return (
    <View>
      <ImageModal
        resizeMode={FastImage.resizeMode.cover}
        swipeToDismiss
        modalImageResizeMode={FastImage.resizeMode.contain}
        style={styles.image}
        source={{uri: currentMessage.image}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 200,
    maxWidth: '100%',
    maxHeight: '100%',
    marginBottom: 3,
  },
});

export default MessageImage;
