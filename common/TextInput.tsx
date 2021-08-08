import React from 'react';
import {StyleSheet, ViewStyle, TextInput, TextInputProps} from 'react-native';
import Text from './Text';
import {BORDER_COLOR, DARK_BLUE, RED} from '../app/colors';

interface ProjetXTextInputProps {
  label?: string;
  error?: string;
  labelStyle?: ViewStyle;
  textInputStyle?: ViewStyle;
}

interface Style {
  label: ViewStyle;
  input: ViewStyle;
  inputMultine: ViewStyle;
  inputError: ViewStyle;
  inputText: ViewStyle;
  errorLabel: ViewStyle;
}

export const INPUT_STYLE = {
  minHeight: 50,
  fontFamily: 'Montserrat Alternates',
  borderColor: BORDER_COLOR,
  borderWidth: 1,
  borderRadius: 15,
  paddingTop: 10,
  paddingBottom: 10,
  paddingLeft: 10,
  paddingRight: 10,
};

const styles = StyleSheet.create<Style>({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_BLUE,
    marginBottom: 5,
  },
  input: INPUT_STYLE,
  inputMultine: {
    minHeight: 100,
    maxHeight: 200,
  },
  inputText: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_BLUE,
  },
  inputError: {
    borderWidth: 2,
    borderColor: RED,
  },
  errorLabel: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
    color: RED,
  },
});

const Input: React.FC<TextInputProps & ProjetXTextInputProps> = ({
  label,
  value,
  error,
  style,
  labelStyle,
  textInputStyle,
  ...props
}) => {
  return (
    <>
      {label && (
        <Text
          style={[styles.label, error ? styles.errorLabel : {}, labelStyle]}>
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor={'#1922487F'}
        style={[
          styles.input,
          props.multiline ? styles.inputMultine : {},
          error ? styles.inputError : {},
          style,
        ]}
        {...props}>
        {value && (
          <Text style={[styles.inputText, textInputStyle]}>{value}</Text>
        )}
        {props.children}
      </TextInput>
      {error && <Text style={styles.errorLabel}>{error}</Text>}
    </>
  );
};

export default Input;
