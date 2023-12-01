import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as Location from 'expo-location';
import { colors, parameters } from '../global/styles';
import { mapStyle } from '../global/mapStyle';
import { filterData } from '../global/data';

const SCREEN_WIDTH = Dimensions.get('window').width;

const TaxiTouch = () => {
  const [latlng, setLatLng] = useState({}); // useState를 컴포넌트 내부로 이동

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
      setLatLng({ latitude: latitude, longitude: longitude });
    } catch (err) {}
  };

  const _map = useRef(1);

  useEffect(() => {
    checkPermission();
    getLocation();
    console.log(latlng);
  }, []); // 여기에 빈 의존성 배열을 포함하는 것이 중요합니다.

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
      >
        {/* 여기에 추가적인 지도 요소를 배치하세요 */}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
});

export default TaxiTouch;
