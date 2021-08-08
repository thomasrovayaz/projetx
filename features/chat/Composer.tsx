import {ProjetXMessage} from './chatsTypes';
import {nanoid} from 'nanoid';
import {getMyId} from '../user/usersApi';
import {Composer, ComposerProps} from 'react-native-gifted-chat';
import React from 'react';
import {StyleSheet} from 'react-native';

type OnImageChangeCallback = (event: {
  nativeEvent: {linkUri: string; mime: string};
}) => void;

type onSend = (messages: ProjetXMessage[]) => void;

const onImageChange =
  (onSend: onSend): OnImageChangeCallback =>
  async ({nativeEvent}) => {
    const {linkUri, mime} = nativeEvent;
    if (linkUri) {
      const message: ProjetXMessage = {
        _id: nanoid(),
        createdAt: new Date(),
        text: '',
        user: {
          _id: getMyId(),
        },
        image: linkUri,
        mime,
      };
      await onSend([message]);
    }
  };
const ProjetXComposer: React.FC<
  ComposerProps & {onSend(messages: ProjetXMessage[]): void}
> = ({onSend, ...props}) => (
  <Composer
    {...props}
    // @ts-ignore
    textInputProps={{onImageChange: onImageChange(onSend)}}
    textInputStyle={styles.textInputStyle}
    composerHeight={40}
  />
);

const styles = StyleSheet.create({
  textInputStyle: {
    fontFamily: 'Montserrat Alternates',
  },
});

export default ProjetXComposer;
