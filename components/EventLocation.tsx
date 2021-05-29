import React from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {ProjetXEvent} from '../api/Events';
import {translate} from '../locales';
import Label from './Label';
import {getMe} from '../api/Users';
import Button from './Button';
import {Navigation} from 'react-native-navigation';
import MapView, {Marker} from 'react-native-maps';
import {showLocation} from 'react-native-map-link';
import Icon from 'react-native-vector-icons/Feather';

interface ProjetXEventLocationProps {
  componentId: string;
  event: ProjetXEvent;
  onUpdate(newEvent: ProjetXEvent): void;
}

interface Style {
  button: ViewStyle;
  map: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  button: {
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
});

const EventLocation: React.FC<ProjetXEventLocationProps> = ({
  componentId,
  event,
  onUpdate,
}) => {
  if (!event.location) {
    const me = getMe()?.uid;
    if (me === event.author) {
      return (
        <Button
          style={styles.button}
          title={translate('Ajouter un lieu')}
          variant="outlined"
          onPress={() => {
            Navigation.push(componentId, {
              component: {
                name: 'CreateEventWhere',
                passProps: {
                  event,
                  onSave: (newEvent: ProjetXEvent) => {
                    Navigation.pop(componentId);
                    onUpdate(newEvent);
                  },
                },
              },
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
      <TouchableOpacity onPress={openMap}>
        <Label>{event.location.formatted_address}</Label>
      </TouchableOpacity>
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
          <Icon name="map-pin" size={50} color="#473B78" />
        </Marker>
      </MapView>
    </>
  );
};

export default EventLocation;
