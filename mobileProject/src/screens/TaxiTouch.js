import React, { useState, useRef } from 'react';
import {View, Image,  Text, StyleSheet} from 'react-native';
import MapView, {Callout, PROVIDER_GOOGLE, Marker, Circle, Polyline, Polygon} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'; //으악 이거 입력 ㅠㅠ
import { GOOGLE_MAPS_API_KEY } from '../config/constants';

export default function GoogleMapsScreen() {
  const mapRef = useRef(null);
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const [markersList, setMarkerList] = useState([
    {
      id:1,
      latitude:37.98825,
      longitude:-122.9862,
      title:'team1',
      description:'ddd'
    },
    {
      id:2,
      latitude:37.28825,
      longitude:-122.2862,
      title:'team2',
      description:'ddd'
    },
  ]);

  const MyCustomMarkerView = () => {
    return( 
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
    return(
      <View>
        <Text>
          MyCustomCalloutVieww22
        </Text>
      </View>
    );
  };
 

  async function moveToLocation(latitude, longitude) {
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta:0.015,
        longitudeDelta:0.0121,
      },
      2000,
    );
  }



  //현재 좌표 찍어줌
  return (
    <View style={styles.container}>
      <View style = {{
        zIndex: 1, 
        flex: 0.5, 
        flexDirection:'row', 
        marginHorizontal:10,
        marginVertical:5,
        }}>
        <View style={{flex:0.5}}>
        <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder='Origin'
        onPress={(data, details = null) => {
          let originCordinates = {
            latitude: details?.geometry?.location.lat,
            longitude: details?.geometry?.location.lng,
          };
          setOrigin(originCordinates);
          // console.log(JSON.stringify(details?.geometry?.location));
          moveToLocation(
            originCordinates
            // details?.geometry?.location.lat, 
            // details?.geometry?.location.lng
            );
        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'en',
        }}
        onFail={(error) => console.log(error)}
      />
        </View>
        <View style={{flex:0.5, marginLeft : 5}}>
        <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder='Destination'
        onPress={(data, details = null) => {
          let destinationCordinated = {
            latitude: details?.geometry?.location.lat,
            longitude: details?.geometry?.location.lng,
          }
          setDestination(destinationCordinated);
          moveToLocation(destinationCordinated);
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
      ref = {mapRef}
      provider = {PROVIDER_GOOGLE}
      style = {styles.map}
      region={{ //첫 화면 구성
        latitude:36.47,
        longitude:127.43,
        latitudeDelta:0.1,
        longitudeDelta:0.1,
        }}>
          {origin !== undefined? <Marker
          coordinate={origin}>
          </Marker> :null}
          {destination !== undefined? <Marker
          coordinate={destination}>
          </Marker> :null}

        {/* // 마커 꾸미기
        <Marker 
          coordinate={{
            latitude:37.98825,
            longitude:-122.0862,
          }}>
          <MyCustomMarkerView />
          <Callout style={{width:300, height:100, backgroundColor:'white'}}>
            <MyCustomCalloutView/>
          </Callout>
        </Marker>
          
        {markersList.map((marker) => {
            return(
              <Marker
              draggable // 드래그 기능
              key={marker.id}
                coordinate={{
                  latitude:marker.latitude,
                  longitude:marker.longitude,
                }}
                title={marker.title}
                description={marker.description}
                onDragEnd={(e) => console.log ({ x:e.nativeEvent.coordinate})}  //드래그한 위치 좌표 찍어줌
              />
            )
          })
          }

          <Circle center={{
            latitude:37.78825,
            longitude:-122.7862,
          }}
          radius={200}
          strokeColor="blue"
          fillColor="red"
          />

          <Polyline 
          strokeWidth={2}
          strokeColor='blue'
          coordinates={[{
            latitude:37.48825,
            longitude:-122.3862,
          },{
            latitude:37.48825,
            longitude:-122.7862,
          }]}/>
          <Polygon 
          strokeWidth={2}
          strokeColor='blue'
          coordinates={[{
            latitude:37.48825,
            longitude:-122.3862,
          },{
            latitude:37.48825,
            longitude:-122.7862,
          },{
            latitude:37.38825,
            longitude:-122.7862,
          },{
            latitude:37.48825,
            longitude:-122.6862,
          }]}/> */}
          {origin != undefined && destination != undefined ? (
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_MAPS_API_KEY}
            />
          ) : null}
      </MapView>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex:1,
    justifyContent: 'flex-end',
    alignItems:'center',
  },
  map:{
    ...StyleSheet.absoluteFillObject,
    zIndex:0
  },
})

