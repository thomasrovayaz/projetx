import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Title from '../../common/Title';
import {translate} from '../../app/locales';
import useTabbarIcon from '../../app/useTabbarIcon';
import PseudoInput from './common/PseudoInput';

const SettingsScreen: NavigationFunctionComponent = ({componentId}) => {
  useTabbarIcon(componentId, 'settings');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}>
        <View style={styles.content}>
          <Title>{translate('Mes préférences')}</Title>
          <View style={styles.input}>
            <PseudoInput label={translate('Pseudo')} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
