import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Title from '../components/Title';
import {translate} from '../locales';
import useTabbarIcon from '../utils/useTabbarIcon';
import TextInput from '../components/TextInput';
import useDebouncedEffect from '../utils/useDebouncedEffect';
import {getMe, updateMyName} from '../api/Users';

const SettingsScreen: NavigationFunctionComponent = ({componentId}) => {
  const [name, setName] = useState<string>(getMe()?.displayName || '');
  useDebouncedEffect(
    () => {
      console.log(name);
      updateMyName(name);
    },
    1000,
    [name],
  );
  useTabbarIcon(componentId, 'settings');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}>
        <View style={styles.content}>
          <Title>{translate('Mes préférences')}</Title>
          <View style={styles.input}>
            <TextInput
              label={translate('Pseudo')}
              value={name}
              onChangeText={setName}
              placeholder={translate('BG du 74')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'stretch',
  },
  input: {
    marginVertical: 20,
  },
});

SettingsScreen.options = {
  topBar: {
    visible: false,
  },
};

export default SettingsScreen;
