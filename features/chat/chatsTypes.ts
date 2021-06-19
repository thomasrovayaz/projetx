import {IMessage} from 'react-native-gifted-chat/lib/Models';

export interface ProjetXMessage extends IMessage {
  mime?: string;
  pollId?: string;
}
