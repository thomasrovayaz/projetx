import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacityProps, ViewStyle, View} from 'react-native';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import {updateParticipation} from '../eventsApi';
import {EventParticipation, ProjetXEvent} from '../eventsTypes';
import {getMe} from '../../user/usersApi';
import {ShareEvent} from '../eventsUtils';
import {useAppDispatch} from '../../../app/redux';
import {editEvent} from '../eventsSlice';
import Toast from 'react-native-simple-toast';

interface ProjetXEventCTAsProps {
  event: ProjetXEvent;
  componentId: string;
}

interface Style {
  container: ViewStyle;
  cta: ViewStyle;
  message: ViewStyle;
  ctaLeft: ViewStyle;
  ctaRight: ViewStyle;
  ctaMiddle: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
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
  message: {
    fontSize: 14,
  },
});

const EventCTAs: React.FC<TouchableOpacityProps & ProjetXEventCTAsProps> = ({
  event,
  componentId,
}) => {
  const dispatch = useAppDispatch();
  const [step, setStep] =
    useState<EventParticipation | 'maybeing' | 'author' | undefined>();

  useEffect(() => {
    const me = getMe()?.uid;
    if (!me || !event || !event.participations) {
      setStep(undefined);
    } else if (me === event.author) {
      setStep('author');
    } else {
      setStep(event.participations[me]);
    }
  }, [event]);

  const showToast = (message: string) => {
    Toast.showWithGravity(message, Toast.SHORT, Toast.TOP);
  };

  const accept = async () => {
    await updateParticipation(event, EventParticipation.going);
    showToast(translate('Que serait une soirée sans toi 😍'));
    setStep(EventParticipation.going);
  };
  const maybe = async () => {
    await updateParticipation(event, EventParticipation.maybe);
    setStep('maybeing');
  };
  const repeatTomorrow = async () => {
    showToast(translate('Rappel enregistré 👌'));
    setStep(EventParticipation.maybe);
  };
  const repeatBefore = async () => {
    showToast(translate('Rappel enregistré 👌'));
    setStep(EventParticipation.maybe);
  };
  const refuse = async () => {
    await updateParticipation(event, EventParticipation.notgoing);
    showToast(translate('Dommage 😢'));
    setStep(EventParticipation.notgoing);
  };
  const edit = () => dispatch(editEvent({event, componentId}));
  const share = async () => ShareEvent(event);

  const renderCtas = () => {
    switch (step) {
      case null:
      case undefined:
      case EventParticipation.notanswered:
      case EventParticipation.maybe:
        return (
          <>
            <Button
              style={[styles.cta, styles.ctaLeft]}
              title={translate('Accepter')}
              onPress={accept}
            />
            <Button
              style={[styles.cta, styles.ctaMiddle]}
              variant="outlined"
              title={translate('Peut-être')}
              onPress={maybe}
            />
            <Button
              style={[styles.cta, styles.ctaRight]}
              variant="outlined"
              title={translate('Refuser')}
              onPress={refuse}
            />
          </>
        );
      case EventParticipation.going:
        return (
          <>
            <Button
              style={[styles.cta, styles.ctaLeft]}
              title={translate("Partager l'événement")}
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
        return (
          <>
            <Button
              style={[styles.cta, styles.ctaLeft]}
              title={translate("Partager l'événement")}
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
      case 'maybeing':
        return (
          <>
            <Button
              style={[styles.cta, styles.ctaLeft]}
              variant="outlined"
              title={translate('Me redemander demain')}
              onPress={repeatTomorrow}
            />
            <Button
              style={[styles.cta, styles.ctaRight]}
              variant="outlined"
              title={translate('Me redemander la veille')}
              onPress={repeatBefore}
            />
          </>
        );
      case 'author':
        return (
          <>
            <Button
              style={[styles.cta, styles.ctaLeft]}
              title={translate("Partager l'événement")}
              onPress={share}
            />
            <Button
              style={[styles.cta, styles.ctaRight]}
              variant="outlined"
              title={translate('Modifier')}
              onPress={edit}
            />
          </>
        );
      default:
        console.log('default partipation');
    }
  };

  return <View style={styles.container}>{renderCtas()}</View>;
};

export default EventCTAs;
