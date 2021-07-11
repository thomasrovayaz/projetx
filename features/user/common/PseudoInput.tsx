import React, {useEffect, useState} from 'react';
import {translate} from '../../../app/locales';
import TextInput from '../../../common/TextInput';
import {getMe, isRegistered, updateMyName} from '../usersApi';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {DARK_BLUE} from '../../../app/colors';

interface PseudoInputProps {
  label?: string;
  onRegister?(): void;
}

const PseudoInput: React.FC<PseudoInputProps> = ({label, onRegister}) => {
  const [name, setName] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  useEffect(() => {
    if (isRegistered()) {
      setName(getMe().displayName || '');
    }
  }, []);
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
          placeholder={translate('Tommy du 74')}
        />
      </View>
      {submitting && (
        <ActivityIndicator
          style={[styles.loader, label ? styles.loaderWithLabel : {}]}
          size="large"
          color={DARK_BLUE}
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
