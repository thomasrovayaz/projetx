import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../../components/Button';
import {translate} from '../../locales';
import DateInput, {DateValue} from '../../components/DateInput';
import {Event} from '../../api/Events';
import moment from 'moment';
import TimeInput from '../../components/TimeInput';

interface CreateEventWhenScreenProps {
  event?: Event;
}

const CreateEventWhenScreen: NavigationFunctionComponent<CreateEventWhenScreenProps> =
  ({componentId, event}) => {
    const [dateValue, setDateValue] = useState<DateValue>();
    const [timeValue, setTimeValue] = useState<moment.Moment>();
    const isSingleDate = event && ['party', 'diner'].includes(event.type);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <View style={styles.content}>
          <View style={styles.item}>
            <DateInput
              range={!isSingleDate}
              value={dateValue}
              onChange={setDateValue}
              placeholder={translate('Ajouter une date')}
            />
          </View>
          {isSingleDate && (
            <View style={styles.item}>
              <TimeInput
                value={timeValue}
                onChange={setTimeValue}
                placeholder={translate('Ajouter une heure')}
              />
            </View>
          )}
        </View>
        <View style={styles.buttonNext}>
          <Button
            title={translate('Suivant >')}
            onPress={() =>
              Navigation.push(componentId, {
                component: {
                  name: 'CreateEventWhere',
                  passProps: {
                    event: {
                      ...event,
                      date: dateValue,
                      time: timeValue,
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
    padding: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  buttonNext: {
    padding: 20,
    height: 90,
  },
});

CreateEventWhenScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: translate('Quand ?'),
    },
  },
  bottomTabs: {
    visible: false,
  },
};

export default CreateEventWhenScreen;
