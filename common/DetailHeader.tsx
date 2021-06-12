import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Title from './Title';

interface ProjetXDetailHeaderProps {
  subtitle?: string;
  title: string;
}

const DetailHeader: React.FC<ProjetXDetailHeaderProps> = ({
  subtitle,
  title,
}) => {
  return (
    <View style={styles.header}>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <Title style={styles.title}>{title}</Title>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#473B78',
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: 'flex-start',
    borderBottomRightRadius: 20,
  },
  subtitle: {
    color: 'white',
    fontFamily: 'Inter',
    fontSize: 14,
  },
  title: {
    color: 'white',
    textAlign: 'left',
  },
});

export default DetailHeader;
