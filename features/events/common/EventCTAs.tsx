import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  View,
  Alert,
} from 'react-native';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import {
  addEventAnswerReminder,
  cancelEvent,
  updateParticipation,
} from '../eventsApi';
import {EventParticipation, ProjetXEvent} from '../eventsTypes';
import {getMe} from '../../user/usersApi';
import {ShareEvent} from '../eventsUtils';
import {useAppDispatch, useAppSelector} from '../../../app/redux';
import {editEvent, selectReminder} from '../eventsSlice';
import moment from 'moment';
import IconButton from '../../../common/IconButton';
import {showToast} from '../../../common/Toast';

interface ProjetXEventCTAsProps {
  event: ProjetXEvent;
  componentId: string;
  small?: Boolean;
}

interface Style {
  container: ViewStyle;
  cta: ViewStyle;
  message: ViewStyle;
  ctaLeft: ViewStyle;
  ctaRight: ViewStyle;
  ctaMiddle: ViewStyle;
  ctaCancel: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    flex: 1,
  },
  ctaLeft: {
    flex: 1,
    marginRight: 5,
  },
  ctaRight: {
    flex: 1,
    marginLeft: 5,
  },
  ctaMiddle: {
    flex: 1,
    marginHorizontal: 5,
  },
  ctaCancel: {
    borderWidth: 0,
    flex: 0,
    padding: 5,
  },
  message: {
    fontSize: 14,
  },
});

const EventCTAs: React.FC<TouchableOpacityProps & ProjetXEventCTAsProps> = ({
  event,
  componentId,
  small,
}) => {
  const dispatch = useAppDispatch();
  const [step, setStep] =
    useState<EventParticipation | 'maybeing' | 'author' | undefined>();
  const reminder = useAppSelector(selectReminder(event.id));
  const hasReminder =
    reminder && reminder.date && moment(reminder.date).isAfter(moment());
  const startingDate = event.getStartingDate();

  useEffect(() => {
    const me = getMe().uid;
    if (!event || !event.participations) {
      setStep(undefined);
    } else if (me === event.author) {
      setStep('author');
    } else {
      setStep(event.participations[me]);
    }
  }, [event]);

  if (startingDate?.isBefore(moment())) {
    return null;
  }

  const accept = async () => {
    await updateParticipation(event, EventParticipation.going);
    await showToast({message: translate('Que serait une soirée sans toi 😍')});
    setStep(EventParticipation.going);
  };
  const maybe = async () => {
    await updateParticipation(event, EventParticipation.maybe);
    setStep(EventParticipation.maybe);
    await addReminder(moment().add({day: 1}));
  };
  const addReminder = async (date: moment.Moment) => {
    try {
      await addEventAnswerReminder(event, date);
      await showToast({message: translate('Rappel enregistré 👌')});
    } catch (e) {
      console.error(e);
      await showToast({
        message: translate("Erreur lors de l'ajout du rappel 😕"),
      });
    }
  };
  const refuse = async () => {
    await updateParticipation(event, EventParticipation.notgoing);
    await showToast({message: translate('Dommage 😢')});
    setStep(EventParticipation.notgoing);
  };
  const edit = () => dispatch(editEvent({event, componentId}));
  const cancel = () => {
    Alert.alert(translate("Annuler l'événement"), translate('Es-tu sûr?'), [
      {
        text: 'Non',
        style: 'cancel',
      },
      {text: 'Oui', onPress: () => cancelEvent(event)},
    ]);
  };
  const share = async () => ShareEvent(event);

  const renderCtas = () => {
    switch (step) {
      case null:
      case undefined:
      case EventParticipation.notanswered:
      case EventParticipation.maybe:
        const isBeforeTommorrow =
          startingDate &&
          startingDate.isBefore(moment().add({day: 1}).subtract({hour: 1}));
        return (
          <>
            <Button
              style={[styles.cta, styles.ctaLeft]}
              title={translate('Accepter')}
              onPress={accept}
            />
            {hasReminder || isBeforeTommorrow ? null : (
              <Button
                style={[styles.cta, styles.ctaMiddle]}
                variant="outlined"
                title={translate('Demande moi demain')}
                onPress={maybe}
              />
            )}
            <Button
              style={[styles.cta, styles.ctaRight]}
              variant="outlined"
              title={translate('Refuser')}
              onPress={refuse}
            />
          </>
        );
      case EventParticipation.going:
        if (small) {
          return null;
        }
        return (
          <>
            <Button
              style={[styles.cta, styles.ctaLeft]}
              title={translate('Partager')}
              onPress={share}
            />
            <Button
              style={[styles.cta, styles.ctaRight]}
              variant="outlined"
              title={translate('Je ne peux plus')}
              onPress={refuse}
            />
          </>
        );
      case EventParticipation.notgoing:
        if (small) {
          return null;
        }
        return (
          <>
            <Button
              style={[styles.cta, styles.ctaLeft]}
              title={translate('Partager')}
              onPress={share}
            />
            <Button
              style={[styles.cta, styles.ctaRight]}
              variant="outlined"
              title={translate('Je suis chaud en fait')}
              onPress={accept}
            />
          </>
        );
      case 'author':
        if (small) {
          return null;
        }
        return (
          <>
            <Button
              style={[styles.cta, styles.ctaLeft]}
              title={translate('Partager')}
              onPress={share}
            />
            <Button
              style={[styles.cta, styles.ctaMiddle]}
              variant="outlined"
              title={translate('Modifier')}
              onPress={edit}
            />
            <IconButton
              style={[styles.ctaRight, styles.ctaCancel]}
              color="#ac0c0c"
              size={20}
              name="trash"
              onPress={cancel}
            />
          </>
        );
      default:
        console.log('default partipation');
    }
  };

  return <View style={[styles.container]}>{renderCtas()}</View>;
};

export default EventCTAs;
