import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import DateInput from '../../../common/DateInput';
import {DateValue, EventDateType, EventType} from '../eventsTypes';
import {saveEvent} from '../eventsApi';
import moment from 'moment';
import TimeInput from '../../../common/TimeInput';
import Tabs, {Tab} from '../../../common/Tabs';
import {useSelector} from 'react-redux';
import {selectCurrentEvent} from '../eventsSlice';
import PollChoicesCreator from '../../polls/PollChoicesCreator';
import {createPoll, getPoll, savePoll} from '../../polls/pollsApi';
import {PollState, PollType} from '../../polls/pollsTypes';
import {selectPoll} from '../../polls/pollsSlice';
import {BEIGE} from '../../../app/colors';
import {useNavigation} from '@react-navigation/native';
import BackButton from '../../../common/BackButton';
import Title from '../../../common/Title';

interface CreateEventWhenScreenProps {
  route: {
    params: {
      backOnSave?: boolean;
    };
  };
}

const CreateEventWhenScreen: React.FC<CreateEventWhenScreenProps> = ({
  route: {
    params: {backOnSave},
  },
}) => {
  const navigation = useNavigation();
  const event = useSelector(selectCurrentEvent);

  const eventPoll = useSelector(selectPoll(event.datePoll));
  const [poll, setPoll] = useState(eventPoll);
  const tabs: Tab[] = [
    {id: EventDateType.fixed, title: translate('Date connue')},
    {id: EventDateType.poll, title: translate('Sondage')},
  ];
  const [tab, setTab] = useState<EventDateType>(event.dateType);
  const [dateValue, setDateValue] = useState<DateValue | undefined>(
    event?.date,
  );
  const [timeValue, setTimeValue] = useState<moment.Moment | undefined>(
    event?.time,
  );
  const [editPollMode, setEditPollMode] = useState(
    event.dateType === EventDateType.poll && event.id,
  );

  useEffect(() => {
    if (event.datePoll) {
      getPoll(event.datePoll);
    }
  }, [event]);
  useEffect(() => {
    if (eventPoll) {
      setPoll(eventPoll);
    }
  }, [eventPoll]);
  useEffect(() => {
    if (tab === EventDateType.poll && !poll) {
      setPoll(createPoll(PollType.DATE, event.id));
    }
  }, [tab, poll, event.id]);

  if (!event) {
    return null;
  }
  const isSingleDate =
    event &&
    event.type &&
    [
      EventType.party,
      EventType.sport,
      EventType.diner,
      EventType.other,
    ].includes(event.type);

  const renderDateSelector = () => {
    return (
      <View style={styles.content}>
        <View style={styles.item}>
          <DateInput
            range={!isSingleDate}
            value={dateValue}
            onChange={setDateValue}
            placeholder={translate(
              isSingleDate
                ? 'Ajouter une date'
                : 'Ajoute les dates\nde début et de fin',
            )}
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
    return (
      <View style={styles.content}>
        <PollChoicesCreator
          poll={poll}
          onChange={setPoll}
          isSingleDate={isSingleDate}
        />
      </View>
    );
  };

  const next = async () => {
    event.dateType =
      poll && poll.state === PollState.FINISHED ? EventDateType.fixed : tab;
    if (poll && tab === EventDateType.poll) {
      await savePoll(poll);
      event.datePoll = poll.id;
    }
    event.date = dateValue;
    event.time = timeValue;
    if (event.id) {
      await saveEvent(event);
    }
    if (backOnSave) {
      return navigation.goBack();
    }
    navigation.navigate('CreateEventWhere');
  };
  const empty = async () => {
    event.dateType = EventDateType.fixed;
    event.date = undefined;
    event.time = undefined;
    if (event.id) {
      await saveEvent(event);
    }
    if (backOnSave) {
      return navigation.goBack();
    }
    navigation.navigate('CreateEventWhere');
  };
  const endPoll = async () => {
    event.dateType = EventDateType.fixed;
    const [, newPoll] = await Promise.all([
      saveEvent(event),
      savePoll({
        ...poll,
        state: PollState.FINISHED,
      }),
    ]);
    setPoll(newPoll);
    setTab(EventDateType.fixed);
    setEditPollMode(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={BEIGE} />
      <View style={styles.header}>
        <BackButton />
      </View>
      <Title style={styles.title}>
        {translate("Quand est prévu l'événement ?")}
      </Title>
      {backOnSave && editPollMode ? (
        <View style={styles.spacing} />
      ) : (
        <View style={styles.tabs}>
          <Tabs
            tabs={tabs}
            selectedTab={tab}
            onChangeTab={tabSelected => setTab(tabSelected as EventDateType)}
          />
        </View>
      )}
      {tab === EventDateType.fixed ? renderDateSelector() : null}
      {tab === EventDateType.poll ? renderPoll() : null}
      <View style={styles.buttonNext}>
        <Button
          style={[styles.cta]}
          title={translate(backOnSave ? 'Enregistrer' : 'Suivant >')}
          onPress={next}
        />
        {tab === EventDateType.poll && editPollMode ? (
          <Button
            style={[styles.cta, styles.ctaRight]}
            variant="outlined"
            title={translate('Terminer le sondage')}
            onPress={endPoll}
          />
        ) : (
          <Button
            style={[styles.cta, styles.ctaRight]}
            variant="outlined"
            title={translate('Plus tard')}
            onPress={empty}
          />
        )}
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
  tabs: {
    padding: 20,
    flexDirection: 'row',
  },
  spacing: {
    height: 20,
  },
  content: {
    paddingHorizontal: 20,
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
    flexDirection: 'row',
  },
  cta: {
    flex: 1,
  },
  ctaRight: {
    marginLeft: 10,
  },
});

export default CreateEventWhenScreen;