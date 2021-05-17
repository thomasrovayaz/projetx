import MapView, {Region} from 'react-native-maps';
import React, {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {translate} from '../locales';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import Config from 'react-native-config';

export interface LocationValue {
  url: string;
  lat: number;
  lng: number;
  formatted_address: string;
}

interface ProjetXLocationPickerProps {
  value?: LocationValue;
  onChange(value: LocationValue): void;
}

const defaultRegion = {
  latitude: 45.764043000000015,
  longitude: 4.835658999999964,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
const REVRSE_GEO_CODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const LocationPicker: React.FC<ProjetXLocationPickerProps> = ({
  value,
  onChange,
}) => {
  const ref = useRef();
  const getInitialRegion = (): Region => {
    if (value) {
      return {
        latitude: value.lat,
        longitude: value.lng,
        latitudeDelta: defaultRegion.latitudeDelta,
        longitudeDelta: defaultRegion.longitudeDelta,
      };
    }
    return defaultRegion;
  };

  const fetchAddressForLocation = (location: Region) => {
    let {latitude, longitude} = location;
    if (
      latitude === defaultRegion.latitude &&
      longitude === defaultRegion.longitude
    ) {
      return;
    }
    if (value && latitude === value.lat && longitude === value.lng) {
      return;
    }
    axios
      .get(
        `${REVRSE_GEO_CODE_URL}?key=${Config.GOOGLE_API_KEY}&latlng=${latitude},${longitude}`,
      )
      .then(({data}) => {
        let {results} = data;
        const result =
          results.find(({types}: {types: string[]}) =>
            types.includes('street_address'),
          ) || results[0];
        if (result) {
          onChange({
            url: `https://www.google.com/maps/place/?q=place_id:${result.place_id}`,
            formatted_address: result.formatted_address,
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
          });
        }
      });
  };

  return (
    <View style={styles.container}>
      <MapView
        // @ts-ignore
        ref={ref}
        style={styles.map}
        initialRegion={getInitialRegion()}
        onRegionChangeComplete={fetchAddressForLocation}
      />
      <Icon name="map-pin" size={50} color="#473B78" />
      <GooglePlacesAutocomplete
        styles={{
          container: styles.autocompleteContainer,
          textInput: styles.textInput,
          listView: styles.listView,
        }}
        placeholder={translate('Rechercher')}
        onPress={(data, details) => {
          if (details) {
            // @ts-ignore
            ref?.current?.animateCamera({
              center: {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              },
            });
            onChange({
              url: details.url,
              formatted_address: details.formatted_address,
              lat: details.geometry.location.lat,
              lng: details.geometry.location.lng,
            });
          }
        }}
        fetchDetails={true}
        query={{
          key: Config.GOOGLE_API_KEY,
          language: 'fr',
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  autocompleteContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    left: 20,
  },
  textInput: {
    borderRadius: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 50,
  },
  listView: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default LocationPicker;
