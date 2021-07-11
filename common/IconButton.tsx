import React from 'react';
import {GestureResponderEvent, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {IconProps} from 'react-native-vector-icons/Icon';
import {DARK_BLUE} from '../app/colors';

interface ProjetXIconButtonProps extends IconProps {
  onPress?: (event: GestureResponderEvent) => void;
  IconComponent?: typeof Icon;
}

const IconButton: React.FC<ProjetXIconButtonProps> = ({
  onPress,
  style,
  color,
  IconComponent = Icon,
  ...props
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[style]} activeOpacity={0.8}>
      <IconComponent {...props} color={color || DARK_BLUE} />
    </TouchableOpacity>
  );
};

export default IconButton;
