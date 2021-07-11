import React from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import Text from './Text';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation, useNavigationState} from '@react-navigation/native';

const style: ViewStyle = {
  padding: 10,
  flexDirection: 'row',
  alignItems: 'center',
};

const BackButton: React.FC = () => {
  const navigation = useNavigation();
  const lastRoute = useNavigationState<any>(
    state => state.routes.length > 1 && state.routes[state.routes.length - 2],
  );
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.goBack()}
      style={style}>
      <Icon name="chevron-left" size={25} />
      <Text>
        {lastRoute.params?.title ? lastRoute.params.title : lastRoute.name}
      </Text>
    </TouchableOpacity>
  );
};

export default BackButton;
