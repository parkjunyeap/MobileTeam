import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '../config/constants';
import MapViewDirections from 'react-native-maps-directions';
import { mapStyle } from '../global/mapStyle'; // mapStyle 가져오기

export default function GoogleMapsScreen() {
  const mapRef = useRef(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [carMarkerPosition, setCarMarkerPosition] = useState(null);

  async function moveToLocation(latitude, longitude) {
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    }, 2000);
  }

  useEffect(() => {
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
            latitude: 36.47,
            longitude: 127.43,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          customMapStyle={mapStyle} /* mapStyle 적용 */
          showsUserLocation={true} // 사용자 위치 표시 활성화
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 // Android의 상태 바 높이를 추가합니다.
  },
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 80, // iOS와 Android에서의 상단 바로부터의 거리를 조정합니다.
    width: '100%',
    zIndex: 10,
  },
  carMarker: {
    width: 32,
    height: 32,
  },
});
