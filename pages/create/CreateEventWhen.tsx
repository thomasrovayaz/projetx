import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';

const CreateEventWhenScreen: NavigationFunctionComponent = ({componentId}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button
            title="Add option"
            color="#710ce3"
            onPress={() =>
              Navigation.push(componentId, {
                component: {
                  name: 'CreateEventWhenAddOption',
                },
              })
            }
          />
          <Button
            title="Poll settings"
            color="#710ce3"
            onPress={() =>
              Navigation.push(componentId, {
                component: {
                  name: 'CreateEventWhenPollSettings',
                },
              })
            }
          />
          <Button
            title="Next"
            color="#710ce3"
            onPress={() =>
              Navigation.push(componentId, {
                component: {
                  name: 'CreateEventWhere',
                },
              })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

CreateEventWhenScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: 'When',
    },
  },
  bottomTabs: {
    visible: false,
  },
};

export default CreateEventWhenScreen;
