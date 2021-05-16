import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Button from '../../components/Button';
import {translate} from '../../locales';
import DateInput, {DateValue} from '../../components/DateInput';

const CreateEventWhenScreen: NavigationFunctionComponent = ({componentId}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [value, setValue] = useState<DateValue>();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
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
          <DateInput
            value={value}
            onChange={setValue}
            placeholder={translate('Ajouter une date')}
          />
          <Button
            title="Add option"
            variant="outlined"
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
            variant="outlined"
            onPress={() =>
              Navigation.push(componentId, {
                component: {
                  name: 'CreateEventWhenPollSettings',
                },
              })
            }
          />
          <Button
            title={translate('Suivant >')}
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
      text: translate('Quand ?'),
    },
  },
  bottomTabs: {
    visible: false,
  },
};

export default CreateEventWhenScreen;
