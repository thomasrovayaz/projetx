import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
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

const EmptyUsersList: React.FC = () => {
  return (
    <View style={styles.emptyList}>
      <Image
        style={styles.emptyImage}
        source={require('../assets/alone.webp')}
      />
      <Text style={styles.emptyText}>
        {translate(
          "Je n'ai pas encore trouvé tes amis\n\nTu peux les rechercher en utilisant leur pseudo dans la barre de recherche 💪",
        )}
      </Text>
    </View>
  );
};

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
    const users = filterWithFuse(
      friends.filter(
        friend =>
          searchText !== '' ||
          friend.score > 0 ||
          selection.usersSelected.includes(friend.id),
      ),
      ['name'],
      searchText,
    ).filter(({name}) => name && name !== '');
    const _userDatas =
      users.length > 0
        ? [
            {
              title:
                searchText !== ''
                  ? translate("Rechercher quelqu'un...")
                  : translate('Mes amis'),
              data: users,
            },
          ]
        : [];
    if (withGroups && groupsMap) {
      const groups = filterWithFuse(
        Object.values(groupsMap),
        ['name'],
        searchText,
      ).filter(({name}) => name && name !== '');
      if (groups.length > 0) {
        setDatas([
          {
            title: translate('Mes groupes de potes'),
            data: groups,
          },
          ..._userDatas,
        ]);
      } else {
        setDatas(_userDatas);
      }
    } else {
      setDatas(_userDatas);
    }
  }, [withGroups, friends, groupsMap, searchText, selection.usersSelected]);

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
          placeholder={translate("Rechercher quelqu'un...")}
        />
      </View>
      <View style={styles.content}>
        <SectionList
          contentContainerStyle={styles.usersList}
          sections={datas}
          renderItem={renderItem}
          ListEmptyComponent={EmptyUsersList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderSectionHeader={({section: {title}}) => (
            <View style={styles.header}>
              <Text style={styles.headerText}>{title}</Text>
            </View>
          )}
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
  emptyList: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'flex-start',
  },
  emptyText: {
    textAlign: 'left',
    fontSize: 18,
    marginVertical: 30,
  },
  emptyImage: {
    width: '100%',
    height: 150,
  },
});

export default SelectableUsersList;