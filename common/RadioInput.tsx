import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  View,
  TextStyle,
  StyleProp,
} from 'react-native';
import Text from './Text';
import Icon from 'react-native-vector-icons/Feather';
import {DARK_BLUE} from '../app/colors';

interface ProjetXRadioProps {
  options: {label: string; value: string; subLabel?: string}[];
  onSelect(selection: string): void;
  selection?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

interface Style {
  container: ViewStyle;
  label: TextStyle;
  sublabel: TextStyle;
  radio: ViewStyle;
  radioWhite: ViewStyle;
  radioSelected: ViewStyle;
  radioSelectedWhite: ViewStyle;
  radioDisabled: ViewStyle;
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
  radio: {
    borderColor: DARK_BLUE,
    borderWidth: 2,
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: 'transparent',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioWhite: {
    borderColor: 'white',
  },
  radioSelected: {
    backgroundColor: DARK_BLUE,
  },
  radioSelectedWhite: {
    backgroundColor: 'white',
  },
  radioDisabled: {opacity: 0.5},
  textContainer: {
    flex: 1,
  },
});

export const Radio: React.FC<{
  selected: boolean | undefined;
  white?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
}> = ({selected, white, style}) => {
  return (
    <View
      style={[
        styles.radio,
        white ? styles.radioWhite : {},
        selected
          ? white
            ? styles.radioSelectedWhite
            : styles.radioSelected
          : {},
        style,
      ]}>
      {selected && (
        <Icon name="check" color={white ? DARK_BLUE : 'white'} size={15} />
      )}
    </View>
  );
};

const RadioInput: React.FC<ProjetXRadioProps> = ({
  options,
  style,
  selection,
  disabled,
  onSelect,
}) => {
  return (
    <>
      {options.map(({label, subLabel, value}) => {
        return (
          <TouchableOpacity
            key={value}
            onPress={() => !disabled && onSelect(value)}
            activeOpacity={0.8}
            disabled={disabled}
            style={[
              styles.container,
              style,
              disabled ? styles.radioDisabled : {},
            ]}>
            <Radio selected={selection === value} />
            <View style={styles.textContainer}>
              <Text style={[styles.label]}>{label}</Text>
              {subLabel ? (
                <Text style={[styles.sublabel]}>{subLabel}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </>
  );
};

export default RadioInput;
