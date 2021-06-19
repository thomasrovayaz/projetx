import {useEffect} from 'react';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Feather';

const useTabbarIcon = (
  componentId: string,
  iconName: string,
  badge?: string,
) => {
  useEffect(() => {
    const setupTabBarIcon = async () => {
      Navigation.mergeOptions(componentId, {
        bottomTab: {
          icon: await Icon.getImageSource(iconName, 25, '#ffffff'),
          badge: badge || '',
          badgeColor: '#E6941B',
        },
      });
    };
    setupTabBarIcon();
  }, [componentId, iconName, badge]);
  return null;
};

export default useTabbarIcon;
