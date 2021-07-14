import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, SectionList, StyleSheet, View} from 'react-native';
import {translate} from '../app/locales';
import {getUsers} from '../features/user/usersApi';
import CheckboxInput from './CheckboxInput';
import TextInput from './TextInput';
import {ProjetXUser} from '../features/user/usersTypes';
import {useSelector} from 'react-redux';
import {selectMyFriends} from '../features/user/usersSlice';
import {filterWithFuse} from '../app/fuse';
import Label from './Label';
import {selectMyGroups} from '../features/groups/groupsSlice';
import {ProjetXGroup} from '../features/groups/groupsTypes';
import Text from './Text';
import {BEIGE, DARK_BLUE} from '../app/colors';

export interface UsersSelection {
  groupsSelected: string[];
  usersSelected: string[];
}

interface SelectableUsersListProps {
  onChange(selection: UsersSelection): void;
  selection: UsersSelection;
  label?: string;
  withGroups?: boolean;
}

const SelectableUsersList: React.FC<SelectableUsersListProps> = ({
  selection,
  onChange,
  label,
  withGroups,
}) => {
  const friends = useSelector(selectMyFriends);
  const groupsMap = useSelector(selectMyGroups);
  const [searchText, onChangeSearchText] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [datas, setDatas] = useState<
    {
      title: string;
      data: (ProjetXUser | ProjetXGroup)[];
    }[]
  >([]);

  const onRefresh = useCallback(() => {
    const fetchUsers = async () => {
      setRefreshing(true);
      await getUsers();
      setRefreshing(false);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const users = filterWithFuse(friends, ['name'], searchText).filter(
      ({name}) => name && name !== '',
    );
    if (withGroups && groupsMap) {
      setDatas([
        {
          title: 'Mes groupes de potes',
          data: [
            ...filterWithFuse(
              Object.values(groupsMap),
              ['name'],
              searchText,
            ).filter(({name}) => name && name !== ''),
          ],
        },
        {title: 'Mes amis', data: users},
      ]);
    } else {
      setDatas([{title: 'Mes amis', data: users}]);
    }
  }, [withGroups, friends, groupsMap, searchText]);

  const onSelect =
    (item: ProjetXGroup | ProjetXUser) => (selected: boolean) => {
      const isGroup = item instanceof ProjetXGroup;
      const selectionKey = isGroup ? 'groupsSelected' : 'usersSelected';
      let usersSelected = selection.usersSelected;
      if (selected) {
        if (isGroup) {
          const group = item as ProjetXGroup;
          usersSelected = [...usersSelected, ...Object.keys(group.users)];
        }
        onChange({
          ...selection,
          usersSelected,
          [selectionKey]: [...selection[selectionKey], item.id],
        });
      } else {
        if (isGroup) {
          const group = item as ProjetXGroup;
          usersSelected = usersSelected.filter(id => !group.users[id]);
        }
        onChange({
          ...selection,
          usersSelected,
          [selectionKey]: selection[selectionKey].filter(id => id !== item.id),
        });
      }
    };

  const renderItem = ({item}: {item: ProjetXUser | ProjetXGroup}) => {
    const isGroup = item instanceof ProjetXGroup;
    const group = isGroup && (item as ProjetXGroup);
    const selectionKey = isGroup ? 'groupsSelected' : 'usersSelected';
    const isSelectedByGroup: string | undefined | false =
      !isGroup &&
      groupsMap &&
      selection.groupsSelected.find(
        (groupId: any) =>
          groupsMap[groupId] && item.id && groupsMap[groupId].users[item.id],
      );
    return (
      <CheckboxInput
        key={item.id}
        label={item.name}
        selected={selection[selectionKey].some(id => id === item.id)}
        onSelect={onSelect(item)}
        disabled={Boolean(isSelectedByGroup)}
        subLabel={
          group
            ? translate('membres', {
                count: Object.keys(group.users).length || 0,
              })
            : isSelectedByGroup
            ? translate('Inclus dans le groupe ') +
              // @ts-ignore
              groupsMap[isSelectedByGroup].name
            : undefined
        }
      />
    );
  };

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
        <SectionList
          contentContainerStyle={styles.usersList}
          sections={datas}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderSectionHeader={({section: {title, data}}) =>
            data.length > 0 ? (
              <View style={styles.header}>
                <Text style={styles.headerText}>{title}</Text>
              </View>
            ) : null
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 5,
    backgroundColor: BEIGE,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_BLUE,
  },
});

export default SelectableUsersList;
