import Label from '../../../common/Label';
import {translate} from '../../../app/locales';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useAppSelector} from '../../../app/redux';
import {selectReminder} from '../eventsSlice';
import {ProjetXEvent} from '../eventsTypes';
import {useNavigation} from '@react-navigation/native';
import Swiper from 'react-native-deck-swiper';
import Button from '../../../common/Button';
import EventItem, {EventCardVariant} from './EventItem';
import {joinEvent, refuseEvent, remindMeEvent} from '../eventsApi';
import {DARK_BLUE} from '../../../app/colors';
import {filterEventsWaitingForAnswers} from '../eventsUtils';

const WaitingForAnswerEvent = ({
  item,
  onOpenEvent,
}: {
  item: ProjetXEvent;
  onOpenEvent(eventId: string): void;
}) => {
  if (!item) {
    return null;
  }
  return (
    <View style={[styles.card]} key={item.id}>
      <EventItem
        event={item}
        variant={EventCardVariant.VERTICAL}
        onPress={() => onOpenEvent(item.id)}
      />
    </View>
  );
};

const WaitingForAnswerEvents: React.FC<{
  style?: StyleProp<ViewStyle>;
  events: ProjetXEvent[];
}> = ({style, events}) => {
  const swiper = useRef<Swiper<ProjetXEvent>>();
  const navigation = useNavigation();
  const [cardIndex, setCardIndex] = useState(0);
  const [waitingForAnswerEvents, setWaitingForAnswerEvents] = useState<
    ProjetXEvent[]
  >([]);
  const currentEvent =
    waitingForAnswerEvents && waitingForAnswerEvents.length > cardIndex
      ? waitingForAnswerEvents[cardIndex]
      : undefined;
  const reminder = useAppSelector(selectReminder(currentEvent?.id));
  const canMaybe = currentEvent && currentEvent.canReportAnswer(reminder);

  useEffect(() => {
    setWaitingForAnswerEvents(filterEventsWaitingForAnswers(events));
  }, [events]);

  const onOpenEvent = (eventId: string, chat?: boolean) => {
    navigation.navigate('Event', {eventId, chat});
  };

  if (!waitingForAnswerEvents || !waitingForAnswerEvents.length) {
    return null;
  }

  const onSwipedLeft = async (index: number) => {
    const event = waitingForAnswerEvents[index];
    await refuseEvent(event);
  };
  const onSwipedRight = async (index: number) => {
    const event = waitingForAnswerEvents[index];
    await joinEvent(event);
  };
  const onSwipedTop = async (index: number) => {
    const event = waitingForAnswerEvents[index];
    await remindMeEvent(event);
  };

  return (
    <View style={[styles.container, style]}>
      <Label style={styles.label}>{translate('En attente de réponse')}</Label>
      {/*@ts-ignore*/}
      <Swiper
        ref={swiper}
        onSwiped={index =>
          setCardIndex(
            index + 1 > waitingForAnswerEvents.length ? 0 : index + 1,
          )
        }
        cardVerticalMargin={20}
        onSwipedLeft={onSwipedLeft}
        onSwipedRight={onSwipedRight}
        onSwipedTop={onSwipedTop}
        //onTapCard={onTapCard}
        stackSize={waitingForAnswerEvents.length}
        cards={waitingForAnswerEvents}
        cardIndex={cardIndex}
        cardStyle={styles.card}
        keyExtractor={event => event.id}
        containerStyle={styles.swiper}
        renderCard={card => (
          <WaitingForAnswerEvent item={card} onOpenEvent={onOpenEvent} />
        )}
        childrenOnTop={false}
        backgroundColor={'transparent'}
        animateOverlayLabelsOpacity={true}
        outputOverlayLabelsOpacityRangeX={[1, 1, 0, 1, 1]}
        outputOverlayLabelsOpacityRangeY={[1, 1, 0, 1, 1]}
        stackSeparation={0}
        disableBottomSwipe
        disableTopSwipe={!canMaybe}
        infinite
        overlayLabelStyle={styles.cardLabel}
        overlayLabels={{
          left: {
            title: translate('Refuser'),
            style: {
              wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
              },
            },
          },
          right: {
            title: translate('Rejoindre'),
          },
          top: {
            title: translate('Rappel demain'),
            style: {
              wrapper: {
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
              },
              label: {
                paddingVertical: 5,
              },
            },
          },
        }}>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            variant={'outlined'}
            onPress={() => swiper.current?.swipeLeft()}
            title={translate('Refuser')}
          />
          {currentEvent && currentEvent.canReportAnswer(reminder) ? (
            <Button
              style={styles.button}
              variant={'outlined'}
              onPress={() => swiper.current?.swipeTop()}
              title={translate('Me rappeler demain')}
            />
          ) : null}
          <Button
            style={styles.button}
            variant={'outlined'}
            onPress={() => {
              swiper.current?.swipeRight();
            }}
            title={translate('Rejoindre')}
          />
        </View>
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 350,
    marginBottom: 20,
  },
  label: {
    paddingHorizontal: 20,
  },
  cardLabel: {
    fontFamily: 'Montserrat Alternates',
    color: DARK_BLUE,
    fontSize: 25,
    padding: 20,
    fontWeight: 'bold',
  },
  swiper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'column-reverse',
  },
  card: {
    height: 250,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default WaitingForAnswerEvents;
