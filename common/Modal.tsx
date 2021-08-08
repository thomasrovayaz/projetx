import React from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import IconButton from './IconButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useKeyboard} from '../app/useKeyboard';

const windowSize = Dimensions.get('window');

const ProjetXModal: React.FC<{
  height: number;
  open: boolean;
  onClose(): void;
  style?: StyleProp<ViewStyle>;
}> = ({open, onClose, height, children, style}) => {
  const {bottom} = useSafeAreaInsets();
  const [keyboardHeight] = useKeyboard();
  const paddingTop = windowSize.height - height - bottom - keyboardHeight;

  return (
    <Modal
      statusBarTranslucent
      transparent
      visible={open}
      animationType="slide"
      onDismiss={onClose}
      onRequestClose={onClose}
      // @ts-ignore
      onBackdropPress={onClose}
      presentationStyle={'pageSheet'}>
      <TouchableOpacity
        style={[StyleSheet.absoluteFill, styles.backdrop]}
        onPress={onClose}>
        <View />
      </TouchableOpacity>
      <View style={[styles.container, {top: paddingTop}]}>
        <View style={[styles.content, {height: height + bottom}, style]}>
          <IconButton
            name={'x'}
            size={30}
            style={styles.closeButton}
            onPress={onClose}
          />
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    position: 'absolute',
    left: 0,
    right: 0,
    flex: 1,
  },
  backdrop: {
    ...Platform.select({
      ios: {},
      android: {
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
    }),
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    paddingTop: 40,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});

export default ProjetXModal;
