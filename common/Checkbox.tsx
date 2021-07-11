import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  View,
  TextStyle,
} from 'react-native';
import Text from './Text';
import Icon from 'react-native-vector-icons/Feather';
import {DARK_BLUE} from '../app/colors';

interface ProjetXCheckboxProps {
  label: string;
  subLabel?: string;
  onSelect(selected: boolean): void;
  selected?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

interface Style {
  container: ViewStyle;
  label: TextStyle;
  sublabel: TextStyle;
  checkbox: ViewStyle;
  checkboxSelected: ViewStyle;
  checkboxDisabled: ViewStyle;
  textContainer: ViewStyle;
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
  },
  sublabel: {
    fontSize: 12,
    textAlign: 'left',
  },
  checkbox: {
    borderColor: DARK_BLUE,
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
    backgroundColor: DARK_BLUE,
  },
  checkboxDisabled: {opacity: 0.5},
  textContainer: {
    flex: 1,
  },
});

const Checkbox: React.FC<ProjetXCheckboxProps> = ({
  label,
  subLabel,
  style,
  selected,
  disabled,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onSelect(!selected)}
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        styles.container,
        style,
        disabled ? styles.checkboxDisabled : {},
      ]}>
      <View style={[styles.checkbox, selected ? styles.checkboxSelected : {}]}>
        {selected && <Icon name="check" color="white" size={15} />}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.label]}>{label}</Text>
        {subLabel ? <Text style={[styles.sublabel]}>{subLabel}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

export default Checkbox;
