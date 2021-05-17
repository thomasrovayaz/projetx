import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../../components/Button';
import {translate} from '../../locales';
import {ProjetXEvent} from '../../api/Events';
import {getMyFriends, ProjetXUser} from '../../api/Friends';
import Checkbox from '../../components/Checkbox';
import TextInput from '../../components/TextInput';

interface CreateEventWhoScreenProps {
  event?: ProjetXEvent;
}

const CreateEventWhoScreen: NavigationFunctionComponent<CreateEventWhoScreenProps> =
  ({componentId, event}) => {
    const [searchText, onChangeSearchText] = useState<string>();
    const [selectedFriends, setSelectedFriends] = useState<ProjetXUser[]>([]);
    const [friends, setFriends] = useState<ProjetXUser[]>([]);

    useEffect(() => {
      const fetchFriends = async () => {
        setFriends(await getMyFriends());
      };
      fetchFriends();
    }, []);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <View style={styles.searchInput}>
          <TextInput
            value={searchText}
            onChangeText={onChangeSearchText}
            placeholder={translate('Rechercher...')}
          />
        </View>
        <FlatList
          contentContainerStyle={styles.content}
          data={friends.filter(
            ({name}) => !searchText || name.includes(searchText),
          )}
          renderItem={({item}: {item: ProjetXUser}) => {
            return (
              <Checkbox
                label={item.name}
                selected={selectedFriends.some(({id}) => id === item.id)}
                onSelect={selected => {
                  if (selected) {
                    setSelectedFriends([...selectedFriends, item]);
                  } else {
                    setSelectedFriends(
                      selectedFriends.filter(({id}) => id !== item.id),
                    );
                  }
                }}
              />
            );
          }}
        />
        <View style={styles.buttonNext}>
          <Button
            title={translate('Suivant >')}
            onPress={() =>
              Navigation.push(componentId, {
                component: {
                  name: 'CreateEventWhat',
                  passProps: {
                    event: {
                      ...event,
                      participants: {
                        notanswered: selectedFriends,
                      },
                    },
                  },
                },
              })
            }
          />
        </View>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  buttonNext: {
    padding: 20,
  },
});

CreateEventWhoScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: translate('Qui ?'),
    },
  },
  bottomTabs: {
    visible: false,
  },
};

export default CreateEventWhoScreen;
