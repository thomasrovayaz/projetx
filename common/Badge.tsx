import React from 'react';
import {Text, View, StyleSheet, ViewStyle} from 'react-native';

interface ProjetXBadgeProps {
  count: number | undefined;
  style?: ViewStyle;
}

const styles = StyleSheet.create({
  tabBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6941B',
    borderRadius: 7,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 20,
    minHeight: 20,
  },
  tabBadge: {
    fontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    color: 'white',
  },
});

const Badge: React.FC<ProjetXBadgeProps> = ({count, style}) => {
  if (!count) {
    return null;
  }
  return (
    <View style={[styles.tabBadgeContainer, style]}>
      <Text style={styles.tabBadge}>{count}</Text>
    </View>
  );
};

export default Badge;
