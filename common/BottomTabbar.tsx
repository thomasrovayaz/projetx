import React from 'react';
import {
  Platform,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs/src/types';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import AddBg from '../assets/bottom_bar_add_button_bg.svg';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AddButton from '../features/home/AddButton';
import {BEIGE, DARK_BEIGE, DARK_BLUE, LIGHT_BLUE} from '../app/colors';

const {width} = Dimensions.get('window');

const getPaddingBottom = (insets: EdgeInsets) =>
  Math.max(
    insets.bottom -
      Platform.select({
        ios: 4,
        default: 0,
      }),
    15,
  );

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
    left: 10,
    right: 10,
  },
  content: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
  },
  addButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    left: width / 2 - 60 / 2 - 10,
    zIndex: 1,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: LIGHT_BLUE,
    borderColor: DARK_BLUE,
  },
  buttonBg: {
    marginLeft: -1,
  },
  item: {
    flex: 1,
    zIndex: 1,
    backgroundColor: BEIGE,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -1,
    borderColor: DARK_BEIGE,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  itemLeft: {
    borderLeftWidth: 1,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  itemRight: {
    borderRightWidth: 1,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  itemSelected: {},
  spacer: {
    width: width,
    backgroundColor: 'transparent',
  },
});

const TabBarItem: React.FC<{
  navigation: BottomTabBarProps['navigation'];
  id: string;
  icon: string;
  IconComponent?: typeof Icon;
  isFocused: boolean;
  style?: ViewStyle;
}> = ({navigation, id, icon, IconComponent = Icon, isFocused, style}) => {
  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: id,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(id);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: id,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      accessibilityRole="button"
      accessibilityState={isFocused ? {selected: true} : {}}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.item, isFocused ? styles.itemSelected : {}, style]}>
      <IconComponent
        name={icon}
        size={25}
        color={isFocused ? DARK_BLUE : DARK_BEIGE}
      />
    </TouchableOpacity>
  );
};

const MyTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const defaultInsets = useSafeAreaInsets();
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={[styles.container]}>
      <View style={[styles.content]}>
        <TabBarItem
          id="Home"
          icon="home"
          navigation={navigation}
          isFocused={state.index === 0}
          style={styles.itemLeft}
        />
        <TabBarItem
          id="Tonight"
          icon="sports-bar"
          IconComponent={MaterialIcon}
          navigation={navigation}
          isFocused={state.index === 1}
        />
        <AddBg fill={BEIGE} stroke={DARK_BEIGE} style={styles.buttonBg} />
        <AddButton style={styles.addButton} />
        <TabBarItem
          id="Events"
          icon="calendar"
          navigation={navigation}
          isFocused={state.index === 2}
        />
        <TabBarItem
          id="Groups"
          icon="users"
          navigation={navigation}
          isFocused={state.index === 3}
          style={styles.itemRight}
        />
      </View>
      <View
        style={[styles.spacer, {height: getPaddingBottom(defaultInsets)}]}
      />
    </View>
  );
};

export default MyTabBar;
