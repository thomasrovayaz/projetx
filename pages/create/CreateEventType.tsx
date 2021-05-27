import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {translate} from '../../locales';
import Button from '../../components/Button';
import {EventType, eventTypes} from '../../utils/EventType';
import {ProjetXEvent} from '../../api/Events';

interface CreateEventTypeScreenProps {
  event: ProjetXEvent;
}

const CreateEventTypeScreen: NavigationFunctionComponent<CreateEventTypeScreenProps> =
  ({componentId, event}) => {
    const next = (option: EventType) => {
      Navigation.push(componentId, {
        component: {
          name: 'CreateEventWhen',
          passProps: {
            event: {
              ...event,
              type: option.id,
            },
          },
        },
      });
    };

    const renderOption = ({item}: {item: EventType}) => {
      return (
        <View style={styles.item}>
          <Button
            variant={event.type === item.id ? 'default' : 'outlined'}
            title={item.title}
            onPress={() => next(item)}
            style={styles.option}
          />
        </View>
      );
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} />
        <FlatList
          contentContainerStyle={styles.content}
          data={eventTypes}
          renderItem={renderOption}
          keyExtractor={item => item.id}
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
  },
  content: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: 'center',
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
