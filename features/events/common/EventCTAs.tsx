import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacityProps, ViewStyle, View} from 'react-native';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import {updateParticipation} from '../eventsApi';
import {EventParticipation, ProjetXEvent} from '../eventsTypes';
import {getMe} from '../../user/usersApi';
import Title from '../../../common/Title';
import {ShareEvent} from '../eventsUtils';
import {useAppDispatch} from '../../../app/redux';
import {editEvent} from '../eventsSlice';

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
    useState<
      | EventParticipation
      | 'accepting'
      | 'maybeing'
      | 'refusing'
      | 'repeating'
      | 'author'
      | null
    >();

  useEffect(() => {
    const me = getMe()?.uid;
    if (!me || !event || !event.participations || !event.participations[me]) {
      setStep(null);
    } else if (me === event.author) {
      setStep('author');
    } else {
      setStep(event.participations[me]);
    }
  }, [event]);

  const accept = () => {
    updateParticipation(event.id, EventParticipation.going);
    setStep('accepting');
    setTimeout(() => {
      setStep(EventParticipation.going);
    }, 2000);
  };
  const maybe = () => {
    updateParticipation(event.id, EventParticipation.maybe);
    setStep('maybeing');
  };
  const repeatTomorrow = () => {
    setStep('repeating');
    setTimeout(() => {
      setStep(EventParticipation.maybe);
    }, 2000);
  };
  const repeatBefore = () => {
    setStep('repeating');
    setTimeout(() => {
      setStep(EventParticipation.maybe);
    }, 2000);
  };
  const refuse = () => {
    updateParticipation(event.id, EventParticipation.notgoing);
    setStep('refusing');
    setTimeout(() => {
      setStep(EventParticipation.notgoing);
    }, 2000);
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
      case 'accepting':
        return (
          <Title style={styles.message}>
            Que serait une soirée sans toi... 😍
          </Title>
        );
      case 'refusing':
        return <Title style={styles.message}>Dommage 😢</Title>;
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
      case 'repeating':
        return <Title style={styles.message}>Rappel enregistré 👌</Title>;
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
    }
  };

  return <View style={styles.container}>{renderCtas()}</View>;
};

export default EventCTAs;
