import React from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ProjetXEvent} from '../eventsTypes';
import Title from '../../../common/Title';
import Text from '../../../common/Text';
import {eventTypeInfos} from '../eventsUtils';
import moment from 'moment';
import {useAppSelector} from '../../../app/redux';
import {selectUser} from '../../user/usersSlice';
import {translate} from '../../../app/locales';
import {dateFormat, dateFormatWithHour} from '../../../common/Date';

const {width} = Dimensions.get('window');

export enum EventCardVariant {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
}

interface EventItemProps {
  event: ProjetXEvent;
  variant?: EventCardVariant;
  onPress(event: GestureResponderEvent): void;
  style?: StyleProp<ViewStyle>;
}

const EventItem: React.FC<EventItemProps> = ({
  event,
  onPress,
  variant,
  style,
}) => {
  const author = useAppSelector(selectUser(event.author));
  const date = event.getStartingDate();
  const waitingForAnswer = event.isWaitingForAnswer();

  const eventInfos = eventTypeInfos(event.type);

  const renderAuthor = () => {
    if (!author || !waitingForAnswer) {
      return '';
    }
    return `${translate('par')} ${author.name}`;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        variant === EventCardVariant.VERTICAL ? styles.card : styles.listitem,
        {
          backgroundColor:
            variant === EventCardVariant.VERTICAL
              ? eventInfos?.bgColor
              : undefined,
        },
        waitingForAnswer ? styles.waitingForAnswer : {},
        style,
      ]}>
      <View
        style={[
          styles.header,
          variant === EventCardVariant.VERTICAL
            ? styles.headerCard
            : styles.headerListitem,
        ]}>
        <Text
          style={[
            styles.emoji,
            variant === EventCardVariant.VERTICAL
              ? styles.emojiCard
              : styles.emojiListitem,
          ]}>
          {eventInfos?.emoji}
        </Text>
        <View
          style={[
            styles.headerTitle,
            variant === EventCardVariant.VERTICAL
              ? styles.headerTitleCard
              : styles.headerTitleListitem,
          ]}>
          <View style={styles.titleContainer}>
            <Title
              style={[
                styles.title,
                variant === EventCardVariant.VERTICAL
                  ? {
                      color: eventInfos?.color,
                    }
                  : {},
              ]}>
              {`${event.title} ${renderAuthor()}`}
            </Title>
          </View>
          {date ? (
            <Text
              style={[
                styles.headerDate,
                date.isBefore(moment()) ? styles.headerDatePassed : {},
                variant === EventCardVariant.VERTICAL
                  ? {
                      color: eventInfos?.color,
                    }
                  : {},
              ]}>
              {waitingForAnswer
                ? date.format(event.time ? dateFormatWithHour : dateFormat)
                : date.fromNow()}
            </Text>
          ) : null}
          {waitingForAnswer ? (
            <Text
              numberOfLines={4}
              style={[
                styles.description,
                variant === EventCardVariant.VERTICAL
                  ? {
                      color: eventInfos?.color,
                    }
                  : {},
              ]}>
              {event.description}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  card: {
    minHeight: 250,
    width: 200,
    justifyContent: 'flex-end',
  },
  listitem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  waitingForAnswer: {
    width: width - 40,
  },
  header: {},
  headerCard: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  headerListitem: {
    flexDirection: 'row',
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: {
    justifyContent: 'center',
  },
  headerTitleCard: {},
  headerTitleListitem: {
    flex: 1,
  },
  emoji: {},
  emojiListitem: {
    fontSize: 40,
    marginRight: 10,
  },
  emojiCard: {
    fontSize: 60,
  },
  headerDate: {
    fontSize: 14,
    marginTop: 5,
  },
  headerDatePassed: {},
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    textAlign: 'left',
  },
  description: {
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 5,
  },
  participants: {
    marginVertical: 5,
  },
  badge: {
    marginRight: 5,
  },
  eventCtas: {
    width: 'auto',
    justifyContent: 'flex-start',
  },
});

export default EventItem;
