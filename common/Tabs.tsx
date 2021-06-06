import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Text,
  View,
  TextStyle,
} from 'react-native';
import Badge from './Badge';

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
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#473B78',
    backgroundColor: 'rgba(71,59,120,0.05)',
  },
  tab: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSelected: {
    borderRadius: 15,
    backgroundColor: '#473B78',
  },
  tabTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Inter',
    color: '#473B78',
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
