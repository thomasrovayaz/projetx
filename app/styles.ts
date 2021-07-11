import {Platform, ViewStyle} from 'react-native';

export const shadow10: ViewStyle | undefined = Platform.select<ViewStyle>({
  ios: {
    shadowColor: 'rgba(25,34,72,0.8)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  android: {
    elevation: 10,
    backgroundColor: 'white',
  },
});

export const shadow5: ViewStyle = {
  shadowColor: 'rgba(25,34,72,0.8)',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 3.84,

  elevation: 5,
};
