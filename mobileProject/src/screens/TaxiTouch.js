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
  const [latlng, setLatLng] = useState({});

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
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={_map}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={mapStyle}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {carsAround.map((item, index) => (
          <MapView.Marker coordinate={item} key={index.toString()}>
            <Image
              source={require('../../assets/carMarker.png')}
              style={styles.carsAround}
              resizeMode="cover"
            />
          </MapView.Marker>
        ))}
      </MapView>

      <Icon
        name="map-marker"
        type="material-community"
        size={30}
        color="blue"
      />

      <FlatList 
        data={filterData}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image style={styles.image2} source={item.image} />
            <Text style={styles.title}>{item.name}</Text>
          </View>
        )}
      />
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
  carsAround: {
    width: 28,
    height: 14,
  },
  card: {
    alignItems: "center",
    margin: SCREEN_WIDTH / 22
  },
  image2: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  title: {
    color: colors.black,
    fontSize: 16
  }
});

export default TaxiTouch;
