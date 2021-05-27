import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacityProps, ViewStyle, View} from 'react-native';
import Button from './Button';
import {translate} from '../locales';
import {ProjetXEvent, updateParticipation} from '../api/Events';
import {getMe} from '../api/Users';
import Title from './Title';
import {Navigation} from 'react-native-navigation';

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
  const [step, setStep] =
    useState<
      | 'going'
      | 'accepting'
      | 'maybe'
      | 'maybeing'
      | 'notgoing'
      | 'refusing'
      | 'notanswered'
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
    updateParticipation(event.id, 'going');
    setStep('accepting');
    setTimeout(() => {
      setStep('going');
    }, 2000);
  };
  const maybe = () => {
    updateParticipation(event.id, 'maybe');
    setStep('maybeing');
  };
  const repeatTomorrow = () => {
    setStep('repeating');
    setTimeout(() => {
      setStep('maybe');
    }, 2000);
  };
  const repeatBefore = () => {
    setStep('repeating');
    setTimeout(() => {
      setStep('maybe');
    }, 2000);
  };
  const refuse = () => {
    updateParticipation(event.id, 'notgoing');
    setStep('refusing');
    setTimeout(() => {
      setStep('notgoing');
    }, 2000);
  };
  const edit = () =>
    Navigation.push(componentId, {
      component: {
        name: 'CreateEventType',
        passProps: {
          event,
        },
      },
    });

  const renderCtas = () => {
    switch (step) {
      case null:
      case undefined:
      case 'notanswered':
      case 'maybe':
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
      case 'going':
        return (
          <>
            <Button
              style={[styles.cta, styles.ctaLeft]}
              title={translate("Partager l'événement")}
              onPress={() => {}}
            />
            <Button
              style={[styles.cta, styles.ctaRight]}
              variant="outlined"
              title={translate('Je ne peux plus')}
              onPress={refuse}
            />
          </>
        );
      case 'notgoing':
        return (
          <>
            <Button
              style={[styles.cta, styles.ctaLeft]}
              title={translate("Partager l'événement")}
              onPress={() => {}}
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
              onPress={() => {}}
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
