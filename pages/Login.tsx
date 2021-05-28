import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {translate} from '../locales';
import Button from '../components/Button';
import Title from '../components/Title';
import auth from '@react-native-firebase/auth';
import TextInput from '../components/TextInput';
import {updateMyName} from '../api/Users';
import {mainRoot} from '../index';
import Logo from '../assets/logo.svg';

const LoginScreen: NavigationFunctionComponent = () => {
  const [name, setName] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (!auth().currentUser) {
      auth().signInAnonymously();
    }
  }, []);

  const register = async () => {
    if (!name || name === '') {
      setSubmitted(true);
      return;
    }
    await updateMyName(name);
    await Navigation.setRoot(mainRoot);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <Logo width={120} height={120} fill="#E6941B" />
        </View>
        <Title style={styles.title}>{translate('Bienvenue 🙌')}</Title>
        <Title style={styles.title}>
          {translate("Comment dois-je t'appeler?")}
        </Title>
        <TextInput
          error={
            submitted && (!name || name === '')
              ? translate("J'ai besoin de ton nom pour continuer")
              : undefined
          }
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder={translate('BG du 74')}
        />
      </ScrollView>
      <View style={styles.buttonCreate}>
        <Button title="S'enregister" onPress={register} />
      </View>
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
