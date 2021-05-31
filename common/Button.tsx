import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  Text,
  TextStyle,
} from 'react-native';

interface ProjetXButtonProps {
  variant?: 'default' | 'outlined';
  title: string;
  textStyle?: TextStyle;
}

interface Style {
  main: ViewStyle;
  default: ViewStyle;
  outlined: ViewStyle;
  mainText: ViewStyle;
  defaultText: ViewStyle;
  outlinedText: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  main: {
    width: '100%',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  default: {
    backgroundColor: '#E6941B',
  },
  outlined: {
    borderColor: '#E6941B',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  mainText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  defaultText: {
    color: 'white',
  },
  outlinedText: {
    color: '#473B78',
  },
});

const Button: React.FC<TouchableOpacityProps & ProjetXButtonProps> = ({
  variant = 'default',
  title,
  textStyle,
  ...props
}) => {
  const isOutlined = variant === 'outlined';
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.8}
      style={StyleSheet.flatten([
        styles.main,
        isOutlined ? styles.outlined : styles.default,
        props.style,
      ])}>
      <Text
        style={[
          styles.mainText,
          isOutlined ? styles.outlinedText : styles.defaultText,
          textStyle,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
