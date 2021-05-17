import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  Text,
} from 'react-native';

interface ProjetXButtonProps {
  variant?: 'default' | 'outlined';
  title: string;
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
  ...props
}) => {
  const isOutlined = variant === 'outlined';
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.8}
      style={{
        ...styles.main,
        ...(isOutlined ? styles.outlined : styles.default),
        // @ts-ignore
        ...props.style,
      }}>
      <Text
        style={{
          ...styles.mainText,
          ...(isOutlined ? styles.outlinedText : styles.defaultText),
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
