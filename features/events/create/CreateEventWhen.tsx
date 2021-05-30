import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import DateInput from '../../../common/DateInput';
import {DateValue, EventType, ProjetXEvent} from '../eventsTypes';
import {saveEvent} from '../eventsApi';
import moment from 'moment';
import TimeInput from '../../../common/TimeInput';
import Tabs, {Tab} from '../../../common/Tabs';
import {useSelector} from 'react-redux';
import {selectCurrentEvent} from '../eventsSlice';

interface CreateEventWhenScreenProps {
  onSave?(newEvent: ProjetXEvent): void;
}

const CreateEventWhenScreen: NavigationFunctionComponent<CreateEventWhenScreenProps> =
  ({componentId, onSave}) => {
    const event = useSelector(selectCurrentEvent);
    const tabs: Tab[] = [
      {id: 'date', title: translate('Date connue')},
      {id: 'poll', title: translate('Sondage')},
    ];
    const [tab, setTab] = useState<string>(tabs[0].id);
    const [dateValue, setDateValue] = useState<DateValue | undefined>(
      event?.date,
    );
    const [timeValue, setTimeValue] = useState<moment.Moment | undefined>(
      event?.time,
    );

    if (!event) {
      return null;
    }

    const renderDateSelector = () => {
      const isSingleDate =
        event &&
        event.type &&
        [EventType.party, EventType.diner].includes(event.type);
      return (
        <View style={styles.content}>
          <View style={styles.item}>
            <DateInput
              range={!isSingleDate}
              value={dateValue}
              onChange={setDateValue}
              placeholder={translate('Ajouter une date')}
            />
          </View>
          {isSingleDate ? (
            <View style={styles.item}>
              <TimeInput
                value={timeValue}
                onChange={setTimeValue}
                placeholder={translate('Ajouter une heure')}
              />
            </View>
          ) : null}
        </View>
      );
    };
    const renderPoll = () => {
      return <View style={styles.content} />;
    };

    const next = async () => {
      event.date = dateValue;
      event.time = timeValue;
      if (event.id) {
        await saveEvent(event);
      }
      if (onSave) {
        return onSave(event);
      }
      await Navigation.push(componentId, {
        component: {
          name: 'CreateEventWhere',
        },
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
        <View style={styles.tabs}>
          <Tabs tabs={tabs} selectedTab={tab} onChangeTab={setTab} />
        </View>
        {tab === 'date' ? renderDateSelector() : null}
        {tab === 'poll' ? renderPoll() : null}
        <View style={styles.buttonNext}>
          <Button
            title={translate(onSave ? 'Enregistrer' : 'Suivant >')}
            onPress={next}
          />
        </View>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    padding: 20,
    flexDirection: 'row',
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
    paddingVertical: 20,
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
