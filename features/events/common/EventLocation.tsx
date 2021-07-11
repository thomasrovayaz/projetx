import React from 'react';
import {StyleSheet, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import {ProjetXEvent} from '../eventsTypes';
import {translate} from '../../../app/locales';
import {getMyId} from '../../user/usersApi';
import Button from '../../../common/Button';
import MapView, {Marker} from 'react-native-maps';
import {showLocation} from 'react-native-map-link';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from '../../../common/Text';
import {useNavigation} from '@react-navigation/native';
import {DARK_BLUE} from '../../../app/colors';

interface ProjetXEventLocationProps {
  event: ProjetXEvent;
}

interface Style {
  button: ViewStyle;
  map: ViewStyle;
  label: TextStyle;
}

const styles = StyleSheet.create<Style>({
  button: {
    marginBottom: 40,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 15,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
});

const EventLocation: React.FC<ProjetXEventLocationProps> = ({event}) => {
  const navigation = useNavigation();

  if (!event.location) {
    if (getMyId() === event.author) {
      return (
        <Button
          style={styles.button}
          title={translate('Ajouter un lieu')}
          variant="outlined"
          onPress={() => {
            navigation.navigate('CreateEventWhere', {
              backOnSave: true,
            });
          }}
        />
      );
    }
    return null;
  }

  const openMap = () => {
    if (!event.location) {
      return;
    }
    showLocation({
      latitude: event.location.lat,
      longitude: event.location.lng,
      title: event.title,
      dialogTitle: translate("Ouvrir l'emplacement"),
      dialogMessage: 'Quel app souherais tu utiliser?',
      cancelText: translate('Annuler'),
    });
  };
  return (
    <>
      <MapView
        toolbarEnabled={true}
        style={styles.map}
        initialRegion={{
          latitude: event.location.lat,
          longitude: event.location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          onPress={openMap}
          centerOffset={{x: 0, y: -25}}
          coordinate={{
            latitude: event.location.lat,
            longitude: event.location.lng,
          }}>
          <Icon name="place" size={50} color={DARK_BLUE} />
        </Marker>
      </MapView>
      <TouchableOpacity onPress={openMap}>
        <Text style={styles.label}>{event.location.formatted_address}</Text>
      </TouchableOpacity>
    </>
  );
};

export default EventLocation;
