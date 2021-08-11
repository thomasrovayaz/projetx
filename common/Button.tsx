import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  ActivityIndicator,
  StyleProp,
} from 'react-native';
import Text from './Text';
import Icon from 'react-native-vector-icons/Feather';
import {translate} from '../app/locales';
import {showToast} from './Toast';
import {BORDER_COLOR, DARK_BLUE} from '../app/colors';

interface ProjetXButtonProps {
  variant?: 'default' | 'outlined';
  title: string;
  icon?: string;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
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
    minHeight: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  default: {
    backgroundColor: DARK_BLUE,
  },
  outlined: {
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  },
  mainText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  defaultText: {
    color: 'white',
  },
  outlinedText: {
    color: DARK_BLUE,
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
  iconStyle,
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
          color={isOutlined ? DARK_BLUE : 'white'}
        />
      );
    }
    if (icon) {
      return (
        <Icon
          name={icon}
          style={[styles.icon, iconStyle]}
          size={20}
          color={isOutlined ? DARK_BLUE : 'white'}
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
