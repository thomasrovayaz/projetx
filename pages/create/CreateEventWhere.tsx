import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../../components/Button';
import {translate} from '../../locales';
import LocationPicker, {LocationValue} from '../../components/LocationPicker';
import Title from '../../components/Title';
import {ProjetXEvent} from '../../api/Events';

interface CreateEventWhenScreenProps {
  event: ProjetXEvent;
}

const CreateEventWhereScreen: NavigationFunctionComponent<CreateEventWhenScreenProps> =
  ({componentId, event}) => {
    const [value, setValue] = useState<LocationValue>(event.location);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} />
        <View style={styles.content}>
          <LocationPicker value={value} onChange={setValue} />
        </View>
        <View style={styles.buttonNext}>
          {value && (
            <Title style={styles.address}>{value.formatted_address}</Title>
          )}
          <Button
            title={translate('Suivant >')}
            onPress={() =>
              Navigation.push(componentId, {
                component: {
                  name: 'CreateEventWho',
                  passProps: {
                    event: {
                      ...event,
                      location: value,
                    },
                  },
                },
              })
            }
          />
        </View>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

CreateEventWhereScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: translate('Où ?'),
    },
  },
  bottomTabs: {
    visible: false,
  },
};

export default CreateEventWhereScreen;
