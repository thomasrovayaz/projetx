import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Title from '../../common/Title';
import {translate} from '../../app/locales';
import PseudoInput from './common/PseudoInput';
import BackButton from '../../common/BackButton';

const SettingsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <View style={styles.header}>
        <BackButton />
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}>
        <View style={styles.content}>
          <Title style={styles.title}>{translate('Mes préférences')}</Title>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  content: {
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'stretch',
  },
  title: {
    textAlign: 'left',
  },
  input: {
    marginVertical: 20,
  },
});

export default SettingsScreen;
