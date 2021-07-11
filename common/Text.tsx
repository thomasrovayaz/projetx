import React from 'react';
import {Text as TextReact, TextStyle, TextProps} from 'react-native';
import {DARK_BLUE} from '../app/colors';

const textstyle: TextStyle = {
  fontFamily: 'Montserrat Alternates',
  color: DARK_BLUE,
};

const Text: React.FC<TextProps> = ({children, style, ...props}) => {
  return (
    <TextReact style={[textstyle, style]} {...props}>
      {children}
    </TextReact>
  );
};

export default Text;
