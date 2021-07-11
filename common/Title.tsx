import React from 'react';
import {TextStyle, TextProps} from 'react-native';
import Text from './Text';

const style: TextStyle = {
  fontSize: 24,
  fontWeight: 'bold',
  textAlign: 'left',
};

const Title: React.FC<TextProps> = ({children, ...props}) => {
  return <Text style={[style, props.style]}>{children}</Text>;
};

export default Title;
