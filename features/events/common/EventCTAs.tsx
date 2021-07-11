import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  View,
  StyleProp,
} from 'react-native';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import {joinEvent, refuseEvent, remindMeEvent} from '../eventsApi';
import {EventParticipation, ProjetXEvent} from '../eventsTypes';
import {getMyId} from '../../user/usersApi';
import {ShareEvent} from '../eventsUtils';
import {useAppSelector} from '../../../app/redux';
import {selectReminder} from '../eventsSlice';
import IconButton from '../../../common/IconButton';
import {RED} from '../../../app/colors';
import QRCodeButton from '../../../common/QRCodeButton';

interface ProjetXEventCTAsProps {
  event: ProjetXEvent;
  small?: Boolean;
  style?: StyleProp<ViewStyle>;
}

interface Style {
  container: ViewStyle;
  cta: ViewStyle;
  message: ViewStyle;
  ctaLeft: ViewStyle;
  ctaRight: ViewStyle;
  ctaMiddle: ViewStyle;
  ctaAccept: ViewStyle;
  ctaCancel: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cta: {
    flex: 1,
  },
  ctaLeft: {
    marginRight: 5,
  },
  ctaRight: {
    marginLeft: 5,
  },
  ctaMiddle: {
    marginHorizontal: 5,
  },
  ctaAccept: {
    width: 100,
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
  small,
  style,
}) => {
  const [step, setStep] =
    useState<EventParticipation | 'maybeing' | 'author' | undefined>();
  const reminder = useAppSelector(selectReminder(event.id));
  const waitingForAnswer = event.isWaitingForAnswer();

  useEffect(() => {
    const me = getMyId();
    if (!event || !event.participations) {
      setStep(undefined);
    } else if (me === event.author) {
      setStep('author');
    } else {
      setStep(event.participations[me]);
    }
  }, [event]);

  const accept = async () => {
    await joinEvent(event);
    setStep(EventParticipation.going);
  };
  const maybe = async () => {
    await remindMeEvent(event);
    setStep(EventParticipation.maybe);
  };
  const refuse = async () => {
    await refuseEvent(event);
    setStep(EventParticipation.notgoing);
  };
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
              variant={'outlined'}
              style={[small ? styles.ctaAccept : styles.cta, styles.ctaLeft]}
              title={translate('Rejoindre')}
              onPress={accept}
            />
            {(!waitingForAnswer && small) ||
            event.canReportAnswer(reminder) ? null : (
              <Button
                variant="outlined"
                style={[styles.cta, styles.ctaMiddle]}
                title={translate('Demander plus tard')}
                onPress={maybe}
              />
            )}
            {!waitingForAnswer && small ? null : (
              <IconButton
                style={[styles.ctaRight]}
                name="x"
                color={RED}
                size={30}
                onPress={refuse}
              />
            )}
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
            <QRCodeButton
              link={event.shareLink}
              title={`${translate(
                "Scan ce QR code pour rejoindre l'événement",
              )} "${event.title}"`}
            />
            <IconButton
              style={[styles.ctaRight]}
              name="x"
              color={RED}
              size={30}
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
            <QRCodeButton
              link={event.shareLink}
              title={`${translate(
                "Scan ce QR code pour rejoindre l'événement",
              )} "${event.title}"`}
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
            <QRCodeButton
              link={event.shareLink}
              title={`${translate(
                "Scan ce QR code pour rejoindre l'événement",
              )} "${event.title}"`}
            />
          </>
        );
      default:
        console.log('default partipation');
    }
  };

  return <View style={[styles.container, style]}>{renderCtas()}</View>;
};

export default EventCTAs;
