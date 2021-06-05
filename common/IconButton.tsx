import React from 'react';
import {GestureResponderEvent, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {IconProps} from 'react-native-vector-icons/Icon';

interface ProjetXIconButtonProps extends IconProps {
  onPress?: (event: GestureResponderEvent) => void;
}

const IconButton: React.FC<ProjetXIconButtonProps> = ({
  onPress,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[style]} activeOpacity={0.8}>
      <Icon {...props} color="#473B78" />
    </TouchableOpacity>
  );
};

export default IconButton;
