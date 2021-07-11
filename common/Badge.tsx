import React from 'react';
import {View, StyleSheet, ViewStyle, StyleProp, TextStyle} from 'react-native';
import Text from './Text';
import {DARK_BLUE} from '../app/colors';

interface ProjetXBadgeProps {
  count: number | undefined;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const styles = StyleSheet.create({
  tabBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DARK_BLUE,
    borderRadius: 7,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 20,
    minHeight: 20,
  },
  tabBadge: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});

const Badge: React.FC<ProjetXBadgeProps> = ({count, style, textStyle}) => {
  if (!count) {
    return null;
  }
  return (
    <View style={[styles.tabBadgeContainer, style]}>
      <Text style={[styles.tabBadge, textStyle]}>{count}</Text>
    </View>
  );
};

export default Badge;
