import React, {useCallback, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {translate} from '../app/locales';
import {getUsers} from '../features/user/usersApi';
import Checkbox from './Checkbox';
import TextInput from './TextInput';
import {ProjetXUser} from '../features/user/usersTypes';
import {useSelector} from 'react-redux';
import {selectMyFriends} from '../features/user/usersSlice';
import {filterWithFuse} from '../app/fuse';
import Label from './Label';

interface SelectableUsersListProps {
  onChange(newSelection: string[]): void;
  selection: string[];
  label?: string;
}

const SelectableUsersList: React.FC<SelectableUsersListProps> = ({
  selection,
  onChange,
  label,
}) => {
  const [searchText, onChangeSearchText] = useState<string>('');
  const friends = useSelector(selectMyFriends);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = useCallback(() => {
    const fetchUsers = async () => {
      setRefreshing(true);
      await getUsers();
      setRefreshing(false);
    };
    fetchUsers();
  }, []);

  return (
    <>
      <View style={styles.searchInput}>
        {label ? <Label>{label}</Label> : null}
        <TextInput
          value={searchText}
          onChangeText={onChangeSearchText}
          placeholder={translate('Rechercher...')}
        />
      </View>
      <View style={styles.content}>
        <FlatList
          contentContainerStyle={styles.usersList}
          data={filterWithFuse(friends, ['name'], searchText).filter(
            ({name}) => name && name !== '',
          )}
          renderItem={({item}: {item: ProjetXUser}) => {
            return (
              <Checkbox
                key={item.id}
                label={item.name}
                selected={selection.some(id => id === item.id)}
                onSelect={selected => {
                  if (selected) {
                    onChange([...selection, item.id]);
                  } else {
                    onChange(selection.filter(id => id !== item.id));
                  }
                }}
              />
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    paddingTop: 20,
    paddingBottom: 0,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  usersList: {paddingTop: 20},
});

export default SelectableUsersList;
