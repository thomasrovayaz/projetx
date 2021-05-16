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

interface EventType {
  id: 'sport' | 'diner' | 'party' | 'weekend' | 'week' | 'travel';
  title: string;
}

const options: EventType[] = [
  {id: 'sport', title: translate('Sortie sport')},
  {id: 'diner', title: translate('Diner entre amis')},
  {id: 'party', title: translate('Soirée entre potes')},
  {id: 'weekend', title: translate('Weekend décompression')},
  {id: 'week', title: translate('Semaine de défoulement')},
  {id: 'travel', title: translate('Voyage loiiin')},
];

const CreateEventTypeScreen: NavigationFunctionComponent = ({componentId}) => {
  const next = (option: EventType) => {
    Navigation.push(componentId, {
      component: {
        name: 'CreateEventWhen',
        passProps: {
          event: {
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
          variant="outlined"
          title={item.title}
          onPress={() => next(item)}
          style={styles.option}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <FlatList
        contentContainerStyle={styles.content}
        data={options}
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
