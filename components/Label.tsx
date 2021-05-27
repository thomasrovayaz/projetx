import React from 'react';
import {Text, TextStyle, TextProps} from 'react-native';

const style: TextStyle = {
  fontFamily: 'Inter',
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
