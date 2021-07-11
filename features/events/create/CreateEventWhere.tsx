import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import LocationPicker, {LocationValue} from './components/LocationPicker';
import Title from '../../../common/Title';
import {saveEvent} from '../eventsApi';
import {useSelector} from 'react-redux';
import {selectCurrentEvent} from '../eventsSlice';
import {BEIGE} from '../../../app/colors';
import {useNavigation} from '@react-navigation/native';
import BackButton from '../../../common/BackButton';

interface CreateEventWhenScreenProps {
  route: {
    params: {
      backOnSave?: boolean;
    };
  };
}

const CreateEventWhereScreen: React.FC<CreateEventWhenScreenProps> = ({
  route: {
    params: {backOnSave},
  },
}) => {
  const navigation = useNavigation();
  const event = useSelector(selectCurrentEvent);
  const [value, setValue] = useState<LocationValue | undefined>(
    event?.location,
  );

  if (!event) {
    return null;
  }

  const next = async () => {
    event.location = value;
    if (event.id) {
      await saveEvent(event);
    }
    if (backOnSave) {
      return navigation.goBack();
    }
    navigation.navigate('CreateEventWho');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={BEIGE} />
      <View style={styles.header}>
        <BackButton />
      </View>
      <Title style={styles.title}>
        {translate("Où se situe l'événement ?")}
      </Title>
      <View style={styles.content}>
        <LocationPicker value={value} onChange={setValue} />
      </View>
      <View style={styles.buttonNext}>
        {value && (
          <Title style={styles.address}>{value.formatted_address}</Title>
        )}
        <Button
          title={translate(backOnSave ? 'Enregistrer' : 'Suivant >')}
          onPress={next}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonNext: {
    padding: 20,
  },
  address: {
    marginBottom: 20,
  },
});

export default CreateEventWhereScreen;
