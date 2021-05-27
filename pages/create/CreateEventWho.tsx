import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../../components/Button';
import {translate} from '../../locales';
import {ProjetXEvent} from '../../api/Events';
import {getMe, getMyFriends, ProjetXUser} from '../../api/Users';
import Checkbox from '../../components/Checkbox';
import TextInput from '../../components/TextInput';

interface CreateEventWhoScreenProps {
  event: ProjetXEvent;
}

const CreateEventWhoScreen: NavigationFunctionComponent<CreateEventWhoScreenProps> =
  ({componentId, event}) => {
    const [searchText, onChangeSearchText] = useState<string>();
    const [selectedFriends, setSelectedFriends] = useState<string[]>(
      event.participations ? Object.keys(event.participations) : [],
    );
    const [friends, setFriends] = useState<ProjetXUser[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);

    const fetchFriends = async () => {
      setRefreshing(true);
      setFriends(await getMyFriends());
      setRefreshing(false);
    };

    const onRefresh = useCallback(() => {
      fetchFriends();
    }, []);

    useEffect(() => {
      fetchFriends();
    }, []);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} />
        <View style={styles.searchInput}>
          <TextInput
            value={searchText}
            onChangeText={onChangeSearchText}
            placeholder={translate('Rechercher...')}
          />
        </View>
        <View style={styles.content}>
          <FlatList
            contentContainerStyle={styles.usersList}
            data={friends.filter(
              ({name}) =>
                !searchText ||
                (name && name.toUpperCase().includes(searchText.toUpperCase())),
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({item}: {item: ProjetXUser}) => {
              return (
                <Checkbox
                  key={item.id}
                  label={item.name}
                  selected={selectedFriends.some(id => id === item.id)}
                  onSelect={selected => {
                    if (selected) {
                      setSelectedFriends([...selectedFriends, item.id]);
                    } else {
                      setSelectedFriends(
                        selectedFriends.filter(id => id !== item.id),
                      );
                    }
                  }}
                />
              );
            }}
          />
        </View>
        <View style={styles.buttonNext}>
          <Button
            title={translate('Suivant >')}
            onPress={() => {
              const participations = event.participations || {};
              for (const selectedFriend of selectedFriends) {
                if (!participations[selectedFriend]) {
                  participations[selectedFriend] = 'notanswered';
                }
              }
              const me = getMe();
              if (me) {
                participations[me.uid] = 'going';
              }
              Navigation.push(componentId, {
                component: {
                  name: 'CreateEventWhat',
                  passProps: {
                    event: {
                      ...event,
                      participations,
                    },
                  },
                },
              });
            }}
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
    paddingTop: 20,
    paddingBottom: 0,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  usersList: {paddingTop: 20},
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
