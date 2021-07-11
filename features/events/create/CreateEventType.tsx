import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {saveEvent} from '../eventsApi';
import {eventTypes} from '../eventsUtils';
import {useSelector} from 'react-redux';
import {selectCurrentEvent} from '../eventsSlice';
import {EventType} from '../eventsTypes';
import Text from '../../../common/Text';
import Title from '../../../common/Title';
import {translate} from '../../../app/locales';
import BackButton from '../../../common/BackButton';
import {BEIGE} from '../../../app/colors';
import {useNavigation} from '@react-navigation/native';

interface CreateEventTypeScreenProps {}

const CreateEventTypeScreen: React.FC<CreateEventTypeScreenProps> = () => {
  const navigation = useNavigation();
  const event = useSelector(selectCurrentEvent);
  const [selection, setSelection] = useState(event?.type);
  if (!event) {
    return null;
  }
  const next = async (eventType: EventType) => {
    setSelection(eventType);
    event.type = eventType;
    if (event.id) {
      await saveEvent(event);
    }
    navigation.navigate('CreateEventWhen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={BEIGE} />
      <View style={styles.header}>
        <BackButton />
      </View>
      <ScrollView>
        <Title style={styles.title}>
          {translate('Quel événement\nsouhaites-tu créer ?')}
        </Title>
        <View style={styles.content}>
          {eventTypes.map(({id, title, emoji, color, bgColor}) => {
            const isSelected = selection === id;
            return (
              <View key={id} style={styles.item}>
                <TouchableOpacity
                  onPress={() => next(id)}
                  style={[
                    styles.option,
                    {
                      backgroundColor: isSelected ? color : bgColor,
                      borderColor: isSelected ? bgColor : color,
                      borderWidth: 1,
                      padding: 16,
                    },
                  ]}
                  activeOpacity={0.8}>
                  <Text style={styles.optionEmoji}>{emoji}</Text>
                  <Text
                    style={[
                      styles.optionText,
                      {color: isSelected ? 'white' : color},
                    ]}>
                    {title}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  title: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  backButton: {},
  item: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  option: {
    flex: 1,
    padding: 20,
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    borderRadius: 15,
  },
  optionEmoji: {fontSize: 40},
  optionText: {fontSize: 24, fontWeight: 'bold'},
});

export default CreateEventTypeScreen;
