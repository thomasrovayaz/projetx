import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  Text,
  TextStyle,
  GestureResponderEvent,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {translate} from '../app/locales';
import {showToast} from './Toast';

interface ProjetXButtonProps {
  variant?: 'default' | 'outlined';
  title: string;
  icon?: string;
  textStyle?: TextStyle;
}

interface Style {
  main: ViewStyle;
  default: ViewStyle;
  outlined: ViewStyle;
  mainText: ViewStyle;
  defaultText: ViewStyle;
  outlinedText: ViewStyle;
  icon: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  main: {
    width: '100%',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
  icon: {
    marginRight: 5,
  },
});

const Button: React.FC<TouchableOpacityProps & ProjetXButtonProps> = ({
  variant = 'default',
  title,
  textStyle,
  icon,
  onPress,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const isOutlined = variant === 'outlined';
  const onClick = async (event: GestureResponderEvent) => {
    if (!onPress || loading) {
      return;
    }
    setLoading(true);
    try {
      await onPress(event);
    } catch (error) {
      console.error(error);
      await showToast({message: translate('Une problème est survenu 😕')});
    }
    setLoading(false);
  };

  const renderIcon = () => {
    if (loading) {
      return (
        <ActivityIndicator
          style={styles.icon}
          size="small"
          color={isOutlined ? '#473B78' : 'white'}
        />
      );
    }
    if (icon) {
      return (
        <Icon
          name={icon}
          style={styles.icon}
          size={20}
          color={isOutlined ? '#473B78' : 'white'}
        />
      );
    }
    return null;
  };

  return (
    <TouchableOpacity
      {...props}
      onPress={onClick}
      activeOpacity={loading ? 1 : 0.8}
      style={StyleSheet.flatten([
        styles.main,
        isOutlined ? styles.outlined : styles.default,
        props.style,
      ])}>
      {renderIcon()}
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
