import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {translate} from '../../app/locales';
import Title from '../../common/Title';
import auth from '@react-native-firebase/auth';
import Logo from '../../assets/logo.svg';
import PseudoInput from './common/PseudoInput';
import {mainRoot} from '../../app/navigation';

const LoginScreen: NavigationFunctionComponent = () => {
  useEffect(() => {
    if (!auth().currentUser) {
      auth().signInAnonymously();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <Logo width={120} height={120} fill="#E6941B" />
        </View>
        <Title style={styles.title}>{translate('Bienvenue 🙌')}</Title>
        <Title style={styles.title}>
          {translate("Comment dois-je t'appeler?")}
        </Title>
        <View style={styles.input}>
          <PseudoInput onRegister={() => Navigation.setRoot(mainRoot)} />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },
  title: {
    textAlign: 'left',
    marginBottom: 20,
    color: '#473B78',
  },
  content: {
    padding: 20,
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
  },
  buttonCreate: {
    padding: 20,
    height: 90,
  },
});

LoginScreen.options = {
  topBar: {
    visible: false,
    title: {
      text: 'Home',
    },
  },
};

export default LoginScreen;
