import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import {DARK_BLUE} from '../app/colors';

const UnreadChip: React.FC<{style?: StyleProp<ViewStyle>}> = ({style}) => {
  return <View style={[styles.unreadChat, style]} />;
};

const styles = StyleSheet.create({
  unreadChat: {
    width: 10,
    height: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: DARK_BLUE,
  },
});

export default UnreadChip;
