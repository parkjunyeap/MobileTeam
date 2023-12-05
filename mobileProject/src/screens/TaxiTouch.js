import React, { useState, useRef } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import MapView, { Callout, PROVIDER_GOOGLE, Marker, Circle, Polyline, Polygon } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'; //으악 이거 입력 ㅠㅠ
import { GOOGLE_MAPS_API_KEY } from '../config/constants';
import MapViewDirections from 'react-native-maps-directions';


export default function GoogleMapsScreen() {
  const mapRef = useRef(null);
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const [markersList, setMarkerList] = useState([
    {
      id: 1,
      latitude: 36.7898,
      longitude: 127.0012,
      title: 'team1',
      description: 'ddd'
    },
    {
      id: 2,
      latitude: 37.28825,
      longitude: 127.1012,
      title: 'team2',
      description: 'ddd'
    },
  ]);

  const MyCustomMarkerView = () => {
    return (
      <Image
        style={{
          width: 30,
          height: 30,
        }}
        source={require('../assets/car.png')}
      />
    );
  };


  const MyCustomCalloutView = () => {
    return (
      <View>
        <Text>
          MyCustomCalloutVieww22
        </Text>
      </View>
    );
  };


  async function moveToLocation(latitude, longitude) {
    console.log(`Moving to latitude: ${latitude}, longitude: ${longitude}`);
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      2000,
    );
  }



  //현재 좌표 찍어줌
  return (
    <View style={styles.container}>
      <View style={{
        zIndex: 1,
        flex: 0.5,
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
      }}>
        <View style={{ flex: 0.5 }}>
          <GooglePlacesAutocomplete
            fetchDetails={true}
            placeholder='Origin'
            onPress={(data, details = null) => {
              if (details) {
                const { lat, lng } = details.geometry.location;
                setOrigin({ latitude: lat, longitude: lng });
                moveToLocation(lat, lng);
              }
            }}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: 'en',
            }}
            onFail={(error) => console.log(error)}
          />
        </View>
        <View style={{ flex: 0.5, marginLeft: 5 }}>
          <GooglePlacesAutocomplete
            fetchDetails={true}
            placeholder='Destination'
            onPress={(data, details = null) => {
              if (details) {
                const { lat, lng } = details.geometry.location;
                console.log(`Destination coordinates: Latitude: ${lat}, Longitude: ${lng}`);
                setDestination({ latitude: lat, longitude: lng });
                moveToLocation(lat, lng);
              }
            }}


            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: 'en',
            }}
            onFail={(error) => console.log(error)}
          />
        </View>
      </View>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{ //첫 화면 구성
          latitude: 36.47,
          longitude: 127.43,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}>
        {origin !== undefined && (
          <Marker coordinate={origin} />
        )}
        {destination !== undefined && (
          <Marker coordinate={destination} />
        )}

        <Marker
          coordinate={{ latitude: 36.7898, longitude: 127.0012 }}>
          <MyCustomMarkerView />
          <Callout style={{ width: 300, height: 100, backgroundColor: 'white' }}>
            <MyCustomCalloutView />
          </Callout>
        </Marker>

        {markersList.map((marker) => (
          <Marker
            draggable
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            description={marker.description}
            onDragEnd={(e) => console.log({ x: e.nativeEvent.coordinate })}
          />
        ))}

        <Circle
          center={{ latitude: 36.7898, longitude: 127.0012 }}
          radius={200}
          strokeColor="blue"
          fillColor="red"
        />

        <Polyline
          strokeWidth={2}
          strokeColor='blue'
          coordinates={[
            { latitude: 36.7898, longitude: 127.0012 },
            { latitude: 36.7898, longitude: 127.0512 }
          ]}
        />

        <Polygon
          strokeWidth={2}
          strokeColor='blue'
          coordinates={[
            { latitude: 36.7898, longitude: 127.0012 },
            { latitude: 36.7898, longitude: 127.0012 },
            { latitude: 36.7898, longitude: 127.0012 },
            { latitude: 36.7898, longitude: 127.0012 }
          ]}
        />

        {origin != undefined && destination != undefined && (
          <MapViewDirections
            origin={origin}
            strokeColor='blue'
            strokeWidth={2}
            destination={destination}
            apikey={GOOGLE_MAPS_API_KEY}
          />
        )}
      </MapView>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0
  },
})

