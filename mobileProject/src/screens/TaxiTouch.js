import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Text, StyleSheet , SafeAreaView} from 'react-native';
import MapView, { Callout, PROVIDER_GOOGLE, Marker, Circle, Polyline, Polygon } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'; //으악 이거 입력 ㅠㅠ
import { GOOGLE_MAPS_API_KEY } from '../config/constants';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import io from 'socket.io-client';

export default function GoogleMapsScreen() {
  const mapRef = useRef(null);
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const [markersList, setMarkerList] = useState();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [friendLocation, setFriendLocation] = useState(null);


//  커스텀마커뷰 _ 자동차 이미지!!!!
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

// 컬아웃 텍스트
  const MyCustomCalloutView = () => {
    return (
      <View>
        <Text>
          택시 택시
        </Text>
      </View>
    );
  };


  //  설정한 화면으로 자동으로 이동함
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

  //현재 나의 위치
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  // 친구위치
  useEffect(() => {
    // Socket.io 클라이언트 연결
    const socket = io('http://localhost:8000');

    // 클라이언트로부터 실시간 위치 정보를 받음
    socket.on('friendLocation', (location) => {
      setFriendLocation(location);
    });

    return () => {
      // 컴포넌트 언마운트 시 소켓 연결 해제
      socket.disconnect();
    };
  }, []);


  // 화면 구성
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}> 
      
      {/* 출발지 검색 */}
        <GooglePlacesAutocomplete
          fetchDetails={true}
          placeholder='출발지'
          onPress={(data, details = null) => {
            if (details) {
              const { lat, lng } = details.geometry.location;
              setOrigin({ latitude: lat, longitude: lng });
              moveToLocation(lat, lng);
            }
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: 'ko',
          }}
          onFail={(error) => console.log(error)}
        />

        {/* 목적지 검색 */}
        <GooglePlacesAutocomplete
          fetchDetails={true}
          placeholder='목적지'
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
            language: 'ko',
          }}
          onFail={(error) => console.log(error)}
      />
    </View>

    {/* 지도 구성 */}
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={{   
        latitude: 36.800131,
        longitude: 127.074941,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
        showsUserLocation={true} // 현재 위치 표시
        followsUserLocation={true} // 현재 위치로 지도 이동
      >

        {/* 출발지 마커 */}
        {origin !== undefined && (
          <Marker 
            title = {'출발지'}
            draggable 
            coordinate={origin} 
            onDragEnd={(e) => console.log('출발지 드래그 한 좌표 :',{  x: e.nativeEvent.coordinate })}/>
        )}

        {/* 목적지 마커 */}
        {destination !== undefined && (
          <Marker 
            title = {'목적지'}
            draggable 
            coordinate={destination} 
            onDragEnd={(e) => console.log('목적지 드래그 한 좌표: ',{  x: e.nativeEvent.coordinate })}/>
        )}

          {/* 마커 연습 _ 커스텀마커뷰(자동차 이미지) 콜아웃(텍스트) -> 이거 위치를 택시 운전자로 바꾸자!! */}
        <Marker
          coordinate={{ latitude: 36.800131, longitude: 127.074941 }}>  
          <MyCustomMarkerView />
          <Callout style={{ width: 300, height: 100, backgroundColor: 'white' }}>
            <MyCustomCalloutView />
          </Callout>
        </Marker>
 
          {/* 경로 선꾸미기 */}
        {origin != undefined && destination != undefined && (
          <MapViewDirections
            origin={origin}
            strokeColor='blue'
            strokeWidth={2}
            destination={destination}
            apikey={GOOGLE_MAPS_API_KEY}
          />
        )}
      {/* 내 위치 */}
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
      </View>
  {/* 실시간 위치 */}
      <View>
        <Text>친구의 실시간 위치: {friendLocation ? `${friendLocation.latitude}, ${friendLocation.longitude}` : '없음'}</Text>
      </View>

      </MapView>
    </SafeAreaView>
  )
}

// 스타일 시트

const styles = StyleSheet.create({
  // safearea
  container: {
    flex: 1,
  },

  //지도
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },

  //출발지, 목적지 검색
  searchContainer: {
    position: 'absolute',
    top: 50,
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    zIndex: 1,
  },
});
