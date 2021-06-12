import {useEffect} from 'react';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Feather';

const useTopbarButton = (
  componentId: string,
  id: string,
  iconName: string,
  onPress: () => void,
  color?: string,
) => {
  useEffect(() => {
    const setupTopBarButtonIcon = async () => {
      Navigation.mergeOptions(componentId, {
        topBar: {
          rightButtons: [
            {
              id,
              icon: await Icon.getImageSource(iconName, 20),
              color,
            },
          ],
        },
      });
    };
    setupTopBarButtonIcon();
    const listener = {
      navigationButtonPressed: ({buttonId}: {buttonId: string}) => {
        if (buttonId === id) {
          onPress();
        }
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(
      listener,
      componentId,
    );
    return () => {
      unsubscribe.remove();
    };
  }, [onPress, color, id, componentId, iconName]);
  return null;
};

export default useTopbarButton;
