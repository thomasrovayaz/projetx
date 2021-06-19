import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {translate} from '../../app/locales';
import Button from '../../common/Button';
import {PollType} from './pollsTypes';
import {pollTypes} from './pollsUtils';
import Title from '../../common/Title';

export interface PollTypes {
  id: PollType;
  title: string;
}

interface CreatePollTypeScreenProps {
  parentId: string;
}

const CreatePollTypeScreen: NavigationFunctionComponent<CreatePollTypeScreenProps> =
  ({componentId, parentId}) => {
    const [selection, setSelection] = useState<PollType>();
    const next = async (option: PollTypes) => {
      setSelection(option.id);
      Navigation.push(componentId, {
        component: {
          name: 'CreatePollChoices',
          passProps: {
            type: selection,
            parentId,
          },
        },
      });
    };

    const renderOption = ({item}: {item: PollTypes}) => {
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
        <Title style={styles.title}>
          {translate('Quel est le type de sondage ?')}
        </Title>
        <FlatList
          contentContainerStyle={styles.content}
          data={pollTypes}
          renderItem={renderOption}
          keyExtractor={item => item.id + ''}
        />
      </SafeAreaView>
    );
  };

CreatePollTypeScreen.options = {
  topBar: {
    title: {
      text: translate('Le type'),
    },
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    marginTop: 20,
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

export default CreatePollTypeScreen;
