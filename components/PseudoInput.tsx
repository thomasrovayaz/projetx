import React, {useState} from 'react';
import {translate} from '../locales';
import TextInput from '../components/TextInput';
import {getMe, updateMyName} from '../api/Users';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

interface PseudoInputProps {
  label?: string;
  onRegister?(): void;
}

const PseudoInput: React.FC<PseudoInputProps> = ({label, onRegister}) => {
  const [name, setName] = useState<string>(getMe()?.displayName || '');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const register = async () => {
    if (!name || name === '') {
      setSubmitted(true);
      return;
    }
    setSubmitting(true);
    await updateMyName(name);
    onRegister && onRegister();
    setSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <TextInput
          label={label}
          error={
            submitted && (!name || name === '')
              ? translate("J'ai besoin de ton nom pour continuer")
              : undefined
          }
          value={name}
          onChangeText={setName}
          onEndEditing={register}
          returnKeyType="done"
          placeholder={translate('BG du 74')}
        />
      </View>
      {submitting && (
        <ActivityIndicator
          style={[styles.loader, label ? styles.loaderWithLabel : {}]}
          size="large"
          color="#473B78"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    width: '100%',
  },
  loader: {
    marginLeft: 10,
  },
  loaderWithLabel: {
    paddingTop: 22.5,
  },
});

export default PseudoInput;
