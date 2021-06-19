import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {translate} from '../app/locales';
import Button from './Button';
import QRCode from 'react-native-qrcode-svg';

const {width} = Dimensions.get('window');

interface ProjetXQRCodeProps {
  link: string;
}

const QRCodeModal: NavigationFunctionComponent<ProjetXQRCodeProps> = ({
  componentId,
  link,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
      <View style={styles.content}>
        <QRCode size={width - 40} value={link} />
      </View>
      <View style={styles.buttons}>
        <Button
          style={styles.cta}
          variant="outlined"
          title={translate('Fermer')}
          onPress={() => Navigation.dismissModal(componentId)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    padding: 20,
    flexDirection: 'row',
  },
  cta: {
    flex: 1,
  },
});

QRCodeModal.options = {
  topBar: {
    title: {
      text: 'QR Code',
    },
  },
};

export default QRCodeModal;
