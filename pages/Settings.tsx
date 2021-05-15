import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  ViewStyle,
} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Title from '../components/Title';
import {translate} from '../locales';
import useTabbarIcon from '../utils/useTabbarIcon';

const SettingsScreen: NavigationFunctionComponent = ({componentId}) => {
  useTabbarIcon(componentId, 'settings');
  const containerStyle: ViewStyle = {
    flex: 1,
  };
  const contentStyle: ViewStyle = {
    padding: 20,
    alignItems: 'stretch',
  };

  return (
    <SafeAreaView style={containerStyle}>
      <StatusBar />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={containerStyle}>
        <View style={contentStyle}>
          <Title>{translate('Mes préférences')}</Title>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

SettingsScreen.options = {
  topBar: {
    visible: false,
  },
};

export default SettingsScreen;
