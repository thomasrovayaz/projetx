import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import DateInput from '../../../common/DateInput';
import {DateValue, EventDateType, EventType} from '../eventsTypes';
import {saveEvent} from '../eventsApi';
import moment from 'moment';
import TimeInput from '../../../common/TimeInput';
import {useSelector} from 'react-redux';
import {selectCurrentEvent} from '../eventsSlice';
import {BEIGE} from '../../../app/colors';
import {useNavigation} from '@react-navigation/native';
import BackButton from '../../../common/BackButton';
import Title from '../../../common/Title';
import Icon from 'react-native-vector-icons/Feather';
import Text from '../../../common/Text';

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

  const [dateValue, setDateValue] = useState<DateValue | undefined>(
    event?.date,
  );
  const [timeValue, setTimeValue] = useState<moment.Moment | undefined>(
    event?.time,
  );

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
      <View style={styles.input}>
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
          {dateValue?.startDate ? null : (
            <View style={styles.dateInfo}>
              <Icon name={'info'} size={20} style={styles.dateInfoIcon} />
              <Text>
                {translate('Tu peux sélectionner une plage de dates')}
              </Text>
            </View>
          )}
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

  const next = async () => {
    event.dateType = EventDateType.fixed;
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={BEIGE} />
      <View style={styles.header}>
        <BackButton />
      </View>
      <View style={styles.content}>
        <Title style={styles.title}>
          {translate("Quand est prévu l'événement ?")}
        </Title>
        {renderDateSelector()}
        <View style={styles.buttonNext}>
          <Button
            style={[styles.cta]}
            title={translate(backOnSave ? 'Enregistrer' : 'Suivant >')}
            onPress={next}
          />
          <Button
            style={[styles.cta, styles.ctaRight]}
            variant="outlined"
            title={translate('Plus tard')}
            onPress={empty}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
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
  input: {
    paddingHorizontal: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  item: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: 20,
  },
  dateInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
  dateInfoIcon: {
    marginRight: 5,
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
