import IconButton from './IconButton';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const QRCodeButton: React.FC<{
  link?: string;
  title?: string;
}> = ({link, title}) => {
  const navigation = useNavigation();
  const qrCode = async () => {
    navigation.navigate('QRCode', {
      link,
      title,
    });
  };
  if (!link) {
    return null;
  }
  return (
    <IconButton
      style={styles.qrcodeButton}
      IconComponent={Icon}
      name="qr-code"
      onPress={qrCode}
      size={20}
    />
  );
};

const styles = StyleSheet.create({
  qrcodeButton: {
    borderWidth: 1,
    borderColor: 'rgba(25,34,72,0.3)',
    borderRadius: 15,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QRCodeButton;
