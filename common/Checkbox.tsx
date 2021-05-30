import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface ProjetXCheckboxProps {
  label: string;
  onSelect(selected: boolean): void;
  selected?: boolean;
  style?: ViewStyle;
}

interface Style {
  container: ViewStyle;
  label: ViewStyle;
  checkbox: ViewStyle;
  checkboxSelected: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    fontFamily: 'Inter',
  },
  checkbox: {
    borderColor: '#473B78',
    borderWidth: 2,
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: 'transparent',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#473B78',
  },
});

const Checkbox: React.FC<ProjetXCheckboxProps> = ({
  label,
  style,
  selected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(!selected)}
      activeOpacity={0.8}
      style={{
        ...styles.container,
        // @ts-ignore
        ...style,
      }}>
      <View
        style={{
          ...styles.checkbox,
          ...(selected ? styles.checkboxSelected : {}),
        }}>
        {selected && <Icon name="check" color="white" size={15} />}
      </View>
      <Text
        style={{
          ...styles.label,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Checkbox;
