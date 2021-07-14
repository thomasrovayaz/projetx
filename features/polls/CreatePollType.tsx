import React, {useState} from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {translate} from '../../app/locales';
import Button from '../../common/Button';
import {PollType} from './pollsTypes';
import {pollTypes} from './pollsUtils';
import Title from '../../common/Title';
import {useNavigation} from '@react-navigation/native';
import {BEIGE, DARK_BLUE, LIGHT_BLUE} from '../../app/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Text from '../../common/Text';
import Icon from 'react-native-vector-icons/Feather';

export interface PollTypes {
  id: PollType;
  title: string;
  icon: string;
}

interface CreatePollTypeScreenProps {}

const CreatePollTypeScreen: React.FC<CreatePollTypeScreenProps> = () => {
  const navigation = useNavigation();
  const {bottom} = useSafeAreaInsets();
  const navigationState = navigation
    .dangerouslyGetParent()
    ?.dangerouslyGetState();
  const params =
    navigationState?.routes[navigationState.routes.length - 1].params;
  //@ts-ignore
  const {parentId, parentTitle, usersToNotify} = params;

  const [selection, setSelection] = useState<PollType>();
  const next = async (option: PollTypes) => {
    setSelection(option.id);
    navigation.navigate('CreatePollChoices', {
      type: option.id,
      parentId,
      parentTitle,
      usersToNotify,
    });
  };

  const renderOption = ({item}: {item: PollTypes}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => next(item)}
        style={styles.item}>
        <Icon name={item.icon} size={30} />
        <Text style={styles.itemTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, {paddingBottom: bottom + 20}]}>
      <StatusBar hidden />
      <Title style={styles.title}>
        {translate('Quel est le type de sondage ?')}
      </Title>
      <FlatList
        contentContainerStyle={styles.content}
        data={pollTypes}
        renderItem={renderOption}
        keyExtractor={item => item.id + ''}
      />
      <Button
        variant={'outlined'}
        title={translate('Annuler')}
        onPress={() => navigation.goBack()}
        style={styles.closeButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: BEIGE,
    paddingHorizontal: 20,
  },
  title: {
    marginVertical: 20,
  },
  content: {
    paddingVertical: 20,
    flexShrink: 1,
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: LIGHT_BLUE,
    borderColor: DARK_BLUE,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    marginBottom: 40,
    borderRadius: 15,
  },
  itemTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
  },
  option: {
    borderColor: DARK_BLUE,
  },
  closeButton: {},
});

export default CreatePollTypeScreen;
