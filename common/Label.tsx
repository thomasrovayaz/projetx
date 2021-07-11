import React from 'react';
import {TextStyle, TextProps} from 'react-native';
import Text from './Text';

const style: TextStyle = {
  fontSize: 14,
  fontWeight: '700',
  marginBottom: 5,
};

const Label: React.FC<TextProps> = ({children, ...props}) => {
  return (
    <Text
      style={{
        ...style,
        // @ts-ignore
        ...props.style,
      }}>
      {children}
    </Text>
  );
};

export default Label;
