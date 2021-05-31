import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {translate} from '../../../app/locales';
import Button from '../../../common/Button';
import {saveEvent} from '../eventsApi';
import {EventTypes, eventTypes} from '../eventsUtils';
import {useSelector} from 'react-redux';
import {selectCurrentEvent} from '../eventsSlice';

interface CreateEventTypeScreenProps {}

const CreateEventTypeScreen: NavigationFunctionComponent<CreateEventTypeScreenProps> =
  ({componentId}) => {
    const event = useSelector(selectCurrentEvent);
    const [selection, setSelection] = useState(event?.type);
    if (!event) {
      return null;
    }
    const next = async (option: EventTypes) => {
      setSelection(option.id);
      event.type = option.id;
      if (event.id) {
        await saveEvent(event);
      }
      await Navigation.push(componentId, {
        component: {
          name: 'CreateEventWhen',
        },
      });
    };

    const renderOption = ({item}: {item: EventTypes}) => {
      return (
        <View style={styles.item}>
          <Button
            variant={selection === item.id ? 'default' : 'outlined'}
            title={item.title}
            onPress={() => next(item)}
            style={styles.option}
          />
        </View>
      );
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} backgroundColor="#473B78" />
        <FlatList
          contentContainerStyle={styles.content}
          data={eventTypes}
          renderItem={renderOption}
          keyExtractor={item => item.id + ''}
        />
      </SafeAreaView>
    );
  };

CreateEventTypeScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: translate('Quoi ?'),
    },
  },
  bottomTabs: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    paddingVertical: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  option: {
    borderColor: '#473B78',
  },
});

export default CreateEventTypeScreen;
