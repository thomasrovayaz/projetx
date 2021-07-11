import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import {translate} from '../app/locales';
import Button from './Button';
import QRCode from 'react-native-qrcode-svg';
import Title from './Title';
import {useNavigation} from '@react-navigation/native';
import {BEIGE} from '../app/colors';

const {width} = Dimensions.get('window');

interface ProjetXQRCodeProps {
  route: {
    params: {
      link: string;
      title?: string;
    };
  };
}

const QRCodeModal: React.FC<ProjetXQRCodeProps> = ({
  route: {
    params: {link, title},
  },
}) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={BEIGE} />
      <View style={styles.content}>
        {title ? <Title style={styles.title}>{title}</Title> : null}
        <QRCode size={width - 40} value={link} />
      </View>
      <View style={styles.buttons}>
        <Button
          style={styles.cta}
          variant="outlined"
          title={translate('Fermer')}
          onPress={() => navigation.goBack()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 40,
  },
  buttons: {
    padding: 20,
    flexDirection: 'row',
  },
  cta: {
    flex: 1,
  },
});

export default QRCodeModal;
