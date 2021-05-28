import React from 'react';
import {
  StyleSheet,
  ViewStyle,
  TextInput,
  TextInputProps,
  Text,
} from 'react-native';

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

const styles = StyleSheet.create<Style>({
  label: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
    marginBottom: 5,
  },
  input: {
    minHeight: 50,
    borderColor: '#473B78',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'rgba(71,59,120,0.05)',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  inputMultine: {
    minHeight: 100,
    maxHeight: 200,
  },
  inputText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: '#473B78',
  },
  inputError: {
    borderWidth: 2,
    borderColor: '#c63535',
  },
  errorLabel: {
    marginTop: 5,
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: '#c63535',
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
        placeholderTextColor="#473B787F"
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
      </TextInput>
      {error && <Text style={styles.errorLabel}>{error}</Text>}
    </>
  );
};

export default Input;
