import React, {useEffect, useState} from 'react';
import {translate} from '../../../app/locales';
import TextInput from '../../../common/TextInput';
import {getMyId, updateMyDescription} from '../usersApi';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {DARK_BLUE} from '../../../app/colors';
import {useAppSelector} from '../../../app/redux';
import {selectUser} from '../usersSlice';

interface PseudoInputProps {
  label?: string;
}

const DescriptionInput: React.FC<PseudoInputProps> = ({label}) => {
  const [description, setDescription] = useState<string>('');
  const myProfile = useAppSelector(selectUser(getMyId()));
  const [submitting, setSubmitting] = useState<boolean>(false);
  useEffect(() => {
    setDescription((myProfile && myProfile.description) || '');
  }, [myProfile]);
  const register = async () => {
    setSubmitting(true);
    await updateMyDescription(description);
    setSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <TextInput
          label={label}
          multiline={true}
          value={description}
          onChangeText={setDescription}
          onEndEditing={register}
          returnKeyType="done"
          placeholder={translate(
            "J'aime la bière un peu beaucoup, \npassionnément, à la folie 🌼",
          )}
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

export default DescriptionInput;