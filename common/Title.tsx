import React from 'react';
import {Text, TextStyle, TextProps} from 'react-native';

const style: TextStyle = {
  fontSize: 24,
  fontWeight: 'bold',
  textAlign: 'center',
  fontFamily: 'Inter',
};

const Title: React.FC<TextProps> = ({children, ...props}) => {
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

export default Title;
