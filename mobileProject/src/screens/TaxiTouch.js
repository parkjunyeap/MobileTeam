import { StatusBar } from 'expo-status-bar'
import React,{useState,useRef,useEffect} from 'react'
import { StyleSheet, Text, View,Dimensions ,ScrollView,Image,FlatList,TouchableOpacity} from 'react-native'
import { Icon} from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE,} from 'react-native-maps'; 
import * as Location from 'expo-location';

const SCREEN_WIDTH = Dimensions.get('window').width
import { colors,parameters } from '../global/styles'
import { filterData,carsAround } from '../global/data'
import { mapStyle} from "../global/mapStyle"
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
    } catch (err) { }
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
        initialRegion={{ ...carsAround[0], latitudeDelta: 0.008, longitudeDelta: 0.008 }}
      >
        

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