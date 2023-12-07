import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '../config/constants';
import * as Location from 'expo-location';

export default function GoogleMapsScreen() {
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

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

      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      const address = addressResponse[0];
      const formattedAddress = `${address.street}, ${address.city}, ${address.region}, ${address.postalCode}, ${address.country}`;
      
      if (autocompleteRef.current) {
        autocompleteRef.current.setAddressText(formattedAddress);
      }
    } catch (error) {
      console.error('Error getting current location', error);
    }
  }

  function moveToLocation(latitude, longitude) {
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }, 2000);
  }

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          ref={autocompleteRef}
          placeholder='출발지'
          fetchDetails={true}
          onPress={(data, details = null) => {
            const { lat, lng } = details.geometry.location;
            setOrigin({ latitude: lat, longitude: lng });
            moveToLocation(lat, lng);
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
        <GooglePlacesAutocomplete
          placeholder='목적지'
          fetchDetails={true}
          onPress={(data, details = null) => {
            const { lat, lng } = details.geometry.location;
            setDestination({ latitude: lat, longitude: lng });
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
          {origin && <Marker coordinate={origin} />}
          {destination && <Marker coordinate={destination} />}
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
