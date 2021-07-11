import React from 'react';
import {StyleSheet, TouchableOpacity, ViewStyle, View} from 'react-native';
import Badge from './Badge';
import Text from './Text';
import {DARK_BLUE} from '../app/colors';

export interface Tab {
  id: string;
  title: string;
  badge?: number;
}
interface ProjetXTabsProps {
  tabs: Tab[];
  selectedTab: string;
  onChangeTab(id: string): void;
}

interface Style {
  tabs: ViewStyle;
  tab: ViewStyle;
  tabSelected: ViewStyle;
  tabTitle: ViewStyle;
  tabTitleSelected: ViewStyle;
  badge: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  tabs: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(25,34,72,0.3)',
    padding: 5,
  },
  tab: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSelected: {
    borderRadius: 12,
    backgroundColor: DARK_BLUE,
  },
  tabTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: DARK_BLUE,
  },
  tabTitleSelected: {
    color: 'white',
  },
  badge: {
    marginLeft: 5,
  },
});

const Tabs: React.FC<ProjetXTabsProps> = ({tabs, selectedTab, onChangeTab}) => {
  return (
    <View style={styles.tabs}>
      {tabs.map(({id, title, badge}) => {
        const isSelected = id === selectedTab;
        return (
          <TouchableOpacity
            key={id}
            activeOpacity={isSelected ? 1 : 0.8}
            onPress={() => {
              onChangeTab(id);
            }}
            style={{
              ...styles.tab,
              ...(isSelected ? styles.tabSelected : {}),
            }}>
            <Text
              style={[
                styles.tabTitle,
                isSelected ? styles.tabTitleSelected : {},
              ]}>
              {title}
            </Text>
            <Badge count={badge} style={styles.badge} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Tabs;
