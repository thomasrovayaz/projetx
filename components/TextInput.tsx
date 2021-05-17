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
}

interface Style {
  label: ViewStyle;
  input: ViewStyle;
  inputMultine: ViewStyle;
  inputText: ViewStyle;
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
});

const Input: React.FC<TextInputProps & ProjetXTextInputProps> = ({
  label,
  value,
  style,
  ...props
}) => {
  return (
    <>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={{
          ...styles.input,
          ...(props.multiline ? styles.inputMultine : {}),
          // @ts-ignore
          ...(style || {}),
        }}
        {...props}>
        {value && <Text style={styles.inputText}>{value}</Text>}
      </TextInput>
    </>
  );
};

export default Input;
