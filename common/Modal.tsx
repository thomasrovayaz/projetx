import React from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import IconButton from './IconButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const windowSize = Dimensions.get('window');

const ProjetXModal: React.FC<{
  height: number;
  open: boolean;
  onClose(): void;
  style?: StyleProp<ViewStyle>;
}> = ({open, onClose, height, children, style}) => {
  const {bottom} = useSafeAreaInsets();

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
      <TouchableWithoutFeedback
        onPressOut={e => {
          if (e.nativeEvent.locationY > 150) {
            onClose();
          }
        }}>
        <View
          style={[
            styles.container,
            {paddingTop: windowSize.height - height - bottom},
          ]}>
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
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
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
