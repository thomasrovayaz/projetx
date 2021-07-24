import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {AppRegistry, LogBox} from 'react-native';
import App from './app/App';
import {CacheManager} from '@georstat/react-native-image-cache';
import {Dirs} from 'react-native-file-access';

CacheManager.config = {
  baseDir: `${Dirs.CacheDir}/images_cache/`,
  blurRadius: 15,
  sourceAnimationDuration: 0,
  thumbnailAnimationDuration: 0,
};

LogBox.ignoreLogs([
  "Modal with 'pageSheet' presentation style and 'transparent' value is not supported",
]);

AppRegistry.registerComponent('Costa', () => App);