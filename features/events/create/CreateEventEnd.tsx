import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Clipboard from '@react-native-community/clipboard';
import Button from '../../../common/Button';
import {translate} from '../../../app/locales';
import {EventParticipation, ProjetXEvent} from '../eventsTypes';
import {notifyNewEvent, saveEvent} from '../eventsApi';
import Title from '../../../common/Title';
import Logo from '../../../assets/logo.svg';
import Label from '../../../common/Label';
import Icon from 'react-native-vector-icons/Feather';
import {ShareEvent} from '../eventsUtils';
import {useSelector} from 'react-redux';
import {selectMyFriends} from '../../user/usersSlice';
import {selectCurrentEvent} from '../eventsSlice';
import {showToast} from '../../../common/Toast';

interface CreateEventEndScreenProps {}

const CreateEventEndScreen: NavigationFunctionComponent<CreateEventEndScreenProps> =
  ({componentId}) => {
    const event = useSelector(selectCurrentEvent);
    const friends = useSelector(selectMyFriends);

    useEffect(() => {
      const save = async (eventToSave: ProjetXEvent) => {
        eventToSave = await saveEvent(eventToSave);
        notifyNewEvent(
          eventToSave,
          friends.filter(friend =>
            [EventParticipation.notanswered, EventParticipation.maybe].includes(
              eventToSave.participations[friend.id],
            ),
          ),
        );
      };

      if (friends && event && !event.id) {
        save(event);
      }
    }, [event, friends]);

    if (!event) {
      return null;
    }

    const share = async () => ShareEvent(event);

    const copyLink = async () => {
      Clipboard.setString(event.shareLink);
      await showToast({message: translate('Lien de partage copié 👍')});
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Logo width={80} height={80} fill="#E6941B" />
            </View>
            <Title>{translate('Invitations envoyées')}</Title>
          </View>
          <View style={styles.content}>
            <Label>
              {translate('Pour inviter d’autres personnes, utilisez ce lien')}
            </Label>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.input}
              onPress={copyLink}>
              <Text style={styles.inputText}>{event.shareLink}</Text>
              <Icon name="copy" size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonNext}>
            <Button
              variant="outlined"
              style={styles.cta}
              title={translate("Voir l'événement")}
              onPress={() => {
                Navigation.setStackRoot(componentId, {
                  component: {
                    name: 'Home',
                    passProps: {
                      event,
                    },
                  },
                });
              }}
            />
            <Button
              title={translate("Partager le lien d'invitation")}
              onPress={share}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {},
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    width: '100%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#473B78',
    backgroundColor: 'rgba(71,59,120,0.05)',
  },
  inputText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#473B78',
    fontFamily: 'Inter',
  },
  buttonNext: {},
  cta: {
    marginVertical: 10,
  },
});

CreateEventEndScreen.options = {
  topBar: {
    visible: false,
  },
  bottomTabs: {
    visible: false,
  },
};

export default CreateEventEndScreen;
