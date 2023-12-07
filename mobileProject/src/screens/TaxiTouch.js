import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '../config/constants';
import * as Location from 'expo-location';

export default function GoogleMapsScreen() {
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
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
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 2000);

      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      const address = addressResponse[0];
      if (address) {
        const formattedAddress = `${address.street}, ${address.city}, ${address.region}, ${address.postalCode}, ${address.country}`;
        if (autocompleteRef.current) {
          autocompleteRef.current.setAddressText(formattedAddress);
        }
      }
    } catch (error) {
      console.error('Error getting current location', error);
    }
  }
  function animateCarMarker(coordinates) {
    let step = 0;
    const numSteps = coordinates.length;
    const interval = setInterval(() => {
      if (step < numSteps) {
        setCarMarkerPosition(coordinates[step]);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 출발지 검색 창 */}
        <GooglePlacesAutocomplete
          ref={autocompleteRef}
          placeholder='출발지'
          fetchDetails={true}
          onPress={(data, details = null) => {
            const { lat, lng } = details.geometry.location;
            setOrigin({ latitude: lat, longitude: lng });
            mapRef.current.animateToRegion({
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }, 2000);
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: 'ko',
          }}
          styles={{
            container: { flex: 0 },
            textInput: { paddingLeft: 20, height: 40 },
          }}
        />
        {/* 목적지 검색 창 */}
        <GooglePlacesAutocomplete
          placeholder='목적지'
          fetchDetails={true}
          onPress={(data, details = null) => {
            const { lat, lng } = details.geometry.location;
            setDestination({ latitude: lat, longitude: lng });
            // 목적지 선택 시에도 지도를 이동할 수 있습니다.
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: 'ko',
          }}
          styles={{
            container: { flex: 0 },
            textInput: { paddingLeft: 20, height: 40 },
          }}
        />
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: origin?.latitude ?? 0,
            longitude: origin?.longitude ?? 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* 사용자 현재 위치 마커 */}
          {origin && <Marker coordinate={origin} />}
          {/* 선택된 목적지 마커 */}
          {destination && <Marker coordinate={destination} />}
          {/* 경로 그리기 */}
          {origin && destination && (
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_MAPS_API_KEY} // 실제 API 키로 교체해야 합니다.
              strokeWidth={3}
              strokeColor="hotpink"
              onReady={(result) => {
                animateCarMarker(result.coordinates);
              }}
            />
          )}
          {carMarkerPosition && (
            <Marker coordinate={carMarkerPosition}>
              <Image
                source={require('../../assets/carMarker.png')}
                style={styles.carMarker}
              />
            </Marker>
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
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchBarContainer: {
    width: '100%',
    zIndex: 1,
  },
  carMarker: {
    width: 32,
    height: 32,
  },
  textInputContainer: {
    backgroundColor: 'rgba(255,255,255,0)',
    borderTopWidth: 0,      // 상단 테두리 없앰
    borderBottomWidth: 0,   // 하단 테두리 없앰
    height: 38,   
  },
  textInput: {
    marginLeft: 0,
    marginRight: 0,
    height: 38,             // `textInputContainer`와 동일하게 설정
    fontSize: 16,           // 폰트 사이즈 조정
    borderRadius: 5,        // 입력 필드의 둥근 모서리 설정
    padding: 0, 
  },
});
