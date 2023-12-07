import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '../config/constants';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

export default function GoogleMapsScreen() {
  const mapRef = useRef(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [carMarkerPosition, setCarMarkerPosition] = useState(null);

  async function getCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setOrigin({ latitude, longitude });
      moveToLocation(latitude, longitude);
    } catch (error) {
      console.error('Error getting current location', error);
    }
  }

  async function moveToLocation(latitude, longitude) {
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    }, 2000);
  }

  useEffect(() => {
    getCurrentLocation();

    if (origin && destination && routeCoordinates.length) {
      animateMarker(routeCoordinates);
    }
  }, [origin, destination, routeCoordinates]);

  const animateMarker = (coordinates) => {
    let step = 0;
    const numSteps = coordinates.length - 1;
    const interval = setInterval(() => {
      if (step <= numSteps) {
        setCarMarkerPosition(coordinates[step]);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          {/* 출발지 검색 */}
          <GooglePlacesAutocomplete
            placeholder='출발지'
            fetchDetails={true}
            onPress={(data, details = null) => {
              if (details && details.geometry && details.geometry.location) {
                const { lat, lng } = details.geometry.location;
                setOrigin({ latitude: lat, longitude: lng });
                moveToLocation(lat, lng);
              } else {
                console.error('No location details available');
              }
            }}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: 'ko',
            }}
          />
          {/* 목적지 검색 */}
          <GooglePlacesAutocomplete
            placeholder='목적지'
            fetchDetails={true}
            onPress={(data, details = null) => {
              if (details && details.geometry && details.geometry.location) {
                const { lat, lng } = details.geometry.location;
                setDestination({ latitude: lat, longitude: lng });
                moveToLocation(lat, lng);
              } else {
                console.error('No location details available');
              }
            }}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: 'ko',
            }}
          />
        </View>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: origin?.latitude || 0,
            longitude: origin?.longitude || 0,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {origin && <Marker coordinate={origin} />}
          {destination && <Marker coordinate={destination} />}
          {carMarkerPosition && (
            <Marker coordinate={carMarkerPosition}>
              <Image
                style={styles.carMarker}
                source={require('../../assets/carMarker.png')}
              />
            </Marker>
          )}
          {origin && destination && (
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={3}
              strokeColor='hotpink'
              onReady={(result) => {
                setRouteCoordinates(result.coordinates);
                if (result.coordinates.length) {
                  animateMarker(result.coordinates);
                }
              }}
            />
          )}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 80,
    width: '100%',
    zIndex: 10,
  },
  carMarker: {
    width: 32,
    height: 32,
  },
});
