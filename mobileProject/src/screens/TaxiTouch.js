import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, TextInput, Button } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as Location from 'expo-location';
import { colors, parameters } from '../global/styles';
import { mapStyle } from '../global/mapStyle';
import { filterData } from '../global/data';

const SCREEN_WIDTH = Dimensions.get('window').width;

const TaxiTouch = () => {
  const [latlng, setLatLng] = useState({});
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const checkPermission = async () => {
    const hasPermission = await Location.requestForegroundPermissionsAsync();
    if (hasPermission.status === 'granted') {
      const permission = await askPermission();
      return permission;
    }
    return true;
  };

  const askPermission = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    return permission.status === 'granted';
  };

  const getLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) return;
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      setLatLng({ latitude, longitude });
    } catch (err) {
      console.error(err);
    }
  };

 // 경로 계산
const calculateRoute = async () => {
  if (!destination || !latlng.latitude || !latlng.longitude) return;

  try {
    const apiKey = 'AIzaSyAA6emfz97tVX6r7lsccbwHIpaby8pLMfc'; // Google Maps API 키를 입력해주세요.
    const origin = `${latlng.latitude},${latlng.longitude}`;
    const dest = `${destination.latitude},${destination.longitude}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const { routes } = data;
      if (routes.length > 0) {
        const { overview_polyline } = routes[0];
        const coordinates = decodePolyline(overview_polyline.points);
        setRoute(coordinates);
      } else {
        console.error('No routes found');
      }
    } else {
      console.error('Failed to calculate the route');
    }
  } catch (err) {
    console.error(err);
  }
};


  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setDestination(coordinate);
  };

  const handleSearch = async () => {
    if (!searchText) return;

    const apiKey = 'AIzaSyAA6emfz97tVX6r7lsccbwHIpaby8pLMfc'; // Google Maps API 키를 입력해주세요.
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchText}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const { results } = data;
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectResult = (result) => {
    const { geometry } = result;
    const { location } = geometry;
    setDestination(location);
    setSearchResults([]);
    setSearchText('');
  };

  const _map = useRef(null);

  useEffect(() => {
    checkPermission();
    getLocation();
  }, []);

  useEffect(() => {
    calculateRoute();
  }, [destination]);

  return (
    <View style={styles.container}>
      <MapView
        ref={_map}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={mapStyle}
        showsUserLocation={true}
        followsUserLocation={true}
        rotateEnabled={true}
        zoomEnabled={true}
        toolbarEnabled={true}
        onPress={handleMapPress}
      >
        {latlng.latitude && latlng.longitude && (
          <Marker
            coordinate={latlng}
            title="현재 위치"
            description="여기서 출발합니다."
          />
        )}
        {destination && (
          <Marker
            coordinate={destination}
            title="목적지"
            description="여기로 가고 싶어요."
          />
        )}
        {route.length > 0 && (
          <Polyline
            coordinates={route}
            strokeWidth={4}
            strokeColor={colors.primary}
          />
        )}
      </MapView>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="목적지를 검색하세요"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Button title="검색" onPress={handleSearch} />
      </View>
      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          {searchResults.map((result) => (
            <Button
              key={result.place_id}
              title={result.name}
              onPress={() => handleSelectResult(result)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: 'absolute',
    top: getStatusBarHeight() + 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  resultsContainer: {
    position: 'absolute',
    top: getStatusBarHeight() + 60,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    zIndex: 1,
  },
});

export default TaxiTouch;
