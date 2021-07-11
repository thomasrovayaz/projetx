import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {translate} from '../../app/locales';
import Title from '../../common/Title';
import auth from '@react-native-firebase/auth';
import Logo from '../../assets/logo.svg';
import PseudoInput from './common/PseudoInput';
import {DARK_BLUE} from '../../app/colors';

const LoginScreen: React.FC<{onRegister(): void}> = ({onRegister}) => {
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
          <Logo width={120} height={120} fill={DARK_BLUE} />
        </View>
        <Title style={styles.title}>{translate('Bienvenue 🙌')}</Title>
        <Title style={styles.label}>
          {translate("Comment dois-je t'appeler?")}
        </Title>
        <View style={styles.input}>
          <PseudoInput onRegister={onRegister} />
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
    marginBottom: 40,
    color: DARK_BLUE,
  },
  content: {
    padding: 20,
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 20,
    color: DARK_BLUE,
  },
  input: {
    width: '100%',
  },
  buttonCreate: {
    padding: 20,
    height: 90,
  },
});

export default LoginScreen;
