import MapView, {EdgePadding, LatLng, Region} from 'react-native-maps';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Platform, PermissionsAndroid} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {translate} from '../../../../app/locales';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import Config from 'react-native-config';
import Geolocation from '@react-native-community/geolocation';
import IconButton from '../../../../common/IconButton';
import {DARK_BLUE} from '../../../../app/colors';

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
const defaultDelta = 0.000001;
const REVRSE_GEO_CODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const isSameLocation = (
  locationA: LatLng,
  locationB: LatLng,
  delta: number = defaultDelta,
) => {
  return (
    Math.abs(locationA.latitude - locationB.latitude) < delta &&
    Math.abs(locationA.longitude - locationB.longitude) < delta
  );
};

const LocationPicker: React.FC<ProjetXLocationPickerProps> = ({
  value,
  onChange,
}) => {
  const [isMapReady, setMapReady] = useState(Platform.OS === 'ios');
  const ref = useRef<MapView>(null);
  const [hasUserLocation, setHasUserLocation] = useState<boolean>(false);

  const initialRegion = useRef(
    value
      ? {
          latitude: value.lat,
          longitude: value.lng,
          latitudeDelta: defaultRegion.latitudeDelta,
          longitudeDelta: defaultRegion.longitudeDelta,
        }
      : defaultRegion,
  );

  const handleMapReady = useCallback(() => {
    if (ref.current) {
      setMapReady(true);
    }
  }, [ref, setMapReady]);

  const fetchAddressForLocation = (coords: Region) => {
    const {latitude, longitude} = coords;
    const delta = coords.latitudeDelta / 100;
    if (
      isSameLocation(coords, defaultRegion, delta) ||
      (value &&
        isSameLocation(
          coords,
          {latitude: value.lat, longitude: value.lng},
          delta,
        ))
    ) {
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

  const zoomIn = async () => {
    if (!ref.current) {
      return;
    }
    const camera = await ref.current.getCamera();
    if (Platform.OS === 'ios') {
      ref.current.animateCamera({altitude: camera.altitude / 2});
    } else {
      ref.current.animateCamera({zoom: camera.zoom + 1});
    }
  };
  const zoomOut = async () => {
    if (!ref.current) {
      return;
    }
    const camera = await ref.current.getCamera();
    if (Platform.OS === 'ios') {
      ref.current.animateCamera({altitude: camera.altitude * 2});
    } else {
      ref.current.animateCamera({zoom: camera.zoom - 1});
    }
  };
  const zoomToUserLocation = async () => {
    Geolocation.getCurrentPosition(position => {
      if (!ref.current) {
        return;
      }
      ref.current.animateCamera({
        center: position.coords,
      });
    });
  };

  useEffect(() => {
    const getUserLocation = async () => {
      let locationPermision;
      if (Platform.OS === 'android') {
        locationPermision = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
      } else {
        locationPermision = PermissionsAndroid.RESULTS.GRANTED;
      }
      if (locationPermision === PermissionsAndroid.RESULTS.GRANTED) {
        const watchId = Geolocation.watchPosition(({coords}) => {
          Geolocation.clearWatch(watchId);
          if (!value && ref.current) {
            ref.current.animateCamera({
              center: coords,
            });
            fetchAddressForLocation({
              ...coords,
              latitudeDelta: defaultDelta * 100,
              longitudeDelta: defaultDelta * 100,
            });
          }
        });
      }
    };
    getUserLocation();
  }, [value]);

  return (
    <View style={styles.container}>
      <MapView
        ref={ref}
        style={isMapReady ? styles.map : {}}
        showsUserLocation={true}
        showsMyLocationButton={false}
        zoomControlEnabled={false}
        onUserLocationChange={() => {
          if (!hasUserLocation) {
            setHasUserLocation(true);
          }
        }}
        mapPadding={isMapReady ? mapPadding : undefined}
        onMapReady={handleMapReady}
        initialRegion={initialRegion.current}
        onRegionChangeComplete={fetchAddressForLocation}
      />
      <Icon
        style={styles.markerIcon}
        name="place"
        size={50}
        color={DARK_BLUE}
      />
      <GooglePlacesAutocomplete
        styles={{
          container: styles.autocompleteContainer,
          textInput: styles.textInput,
          listView: styles.listView,
        }}
        placeholder={translate('Rechercher')}
        onPress={(data, details) => {
          if (details) {
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
      <View style={styles.toolbar}>
        {hasUserLocation ? (
          <IconButton
            onPress={zoomToUserLocation}
            style={[styles.toolbarButton]}
            size={18}
            name="crosshair"
          />
        ) : null}
        <IconButton
          onPress={zoomIn}
          style={styles.toolbarButton}
          size={18}
          name="zoom-in"
        />
        <IconButton
          onPress={zoomOut}
          style={[styles.toolbarButton]}
          size={18}
          name="zoom-out"
        />
      </View>
    </View>
  );
};

const mapPadding: EdgePadding = {
  right: 10,
  bottom: 0,
  left: 0,
  top: 80,
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
    zIndex: 2,
  },
  toolbar: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  toolbarButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
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
  markerIcon: {
    marginTop: -50 + 80,
  },
});

export default LocationPicker;
