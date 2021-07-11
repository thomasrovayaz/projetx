import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {AppRegistry, LogBox} from 'react-native';
import App from './app/App';

LogBox.ignoreLogs([
  "Modal with 'pageSheet' presentation style and 'transparent' value is not supported",
]);

AppRegistry.registerComponent('Costa', () => App);
