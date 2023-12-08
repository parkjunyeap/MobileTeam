import { StyleSheet, Text, View, TouchableOpacity,Alert } from "react-native";
import { UserType } from "../UserContext";
import { useContext, useEffect } from "react";
import io from 'socket.io-client';

// import { MapView } from "react-native-maps";
const TaxiTouch = () => {
  const { userId, setUserId } = useContext(UserType);
  console.log(userId)
  const passengerId = userId
  const socket = io("http://localhost:8001");

  useEffect(() => {
    // 컴포넌트가 마운트될 때 Socket.io 서버에 연결합니다.
    socket.connect();
    // 탑승자 연결 이벤트를 서버로 전송
    socket.emit('passengerConnect', passengerId)
    // 탑승자가 서버로부터 메시지를 받을 때

    socket.on('acceptRejectRequestToPassenger', (message) => {
      console.log('운전사의 응답을 받았습니다.', message);
      const { requestId, status } = message;
  
      if (status === 'accepted') {
        Alert.alert('요청 수락', '운전사가 요청을 수락했습니다.');
        console.log('운전사가 요청을 수락했습니다.')
      } else if (status === 'rejected') {
        Alert.alert('요청 거절', '운전사가 요청을 거절했습니다.');
        console.log('운전사가 요청을 거절했습니다.')
      }
    });
    // 컴포넌트가 언마운트될 때 연결을 해제합니다.
    return () => {
      socket.disconnect();
    }
  }, []);

  const requestD = {
    userId: userId,
    driverId: "656b0d69cadb44c3b89e1e7e",
    startPoint: "천안아산역",
    endPoint: "선문대학교",
    requestDate: new Date(),
    pay: "10000",
    distance: "0.5"
  }
  //서버로 전달
  const requestDtoS = () => {
    console.log("임시 데이터 확인 :", requestD)
    socket.emit('passengerRequest', requestD);
  }

  return (
    <View style={styles.container}>
      {/* <MapView style={styles.maps} /> */}
      <Text> 택시맵 </Text>
      <TouchableOpacity
        onPress={requestDtoS}
      >
        <Text>요청</Text>
      </TouchableOpacity>
    </View>
  );
};
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  Modal,
} from "react-native";
import MapView, { Callout, PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "../config/constants";
import MapViewDirections from "react-native-maps-directions";
import axios from "axios";

import Driver from "../components/Driver";

// 드라이버 객체 모달창 나오게 하기 위해서
//

// import { PermissionsAndroid, Platform } from "react-native";
// import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";

import * as Location from "expo-location";

import { UserType } from "../UserContext";

// 함수 선언 부
async function requestLocationPermission() {
  if (Platform.OS === "ios") {
    const res = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return res === RESULTS.GRANTED;
  } else {
    const res = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    return res === RESULTS.GRANTED;
  }
}

// 자기 위치 받아와서
function getLocation() {
  Geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      // 여기서 MapView의 region 또는 initialRegion 설정

      setFirstLatitude(latitude);
      setFirstLongitude(longitude);

      // 처음 내 위치 설정
    },
    (error) => {
      console.error(error);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
}

export default function GoogleMapsScreen() {
  const [drivers, setDrivers] = useState([]);
  // 택시 드라이버 배열
  //

  const [selectedDriver, setSelectedDriver] = useState(null); // 선택한 드라이버
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달창 뜨는지 안뜨는지? 설정

  const [origin, setOrigin] = useState(null); // 좌표값
  const [destination, setDestination] = useState(null); // 좌표값 설정
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [movingMarkerPosition, setMovingMarkerPosition] = useState(null);

  const [firstLatitude, setFirstLatitude] = useState(null);
  const [firstLongitude, setFirstLongitude] = useState(null);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [startPoint, setStartPoint] = useState(""); // 입력한 출발지
  const [endPoint, setEndPoint] = useState(""); // 입력한 목적지.

  const { userId, setUserId } = useContext(UserType); // 로그인한 유저

  const [taxiLocations, setTaxiLocations] = useState([]); // 택시 기사들의 위치를 받아와서 여기에 적재

  // 택시 위치 정보들 갖고오는 함수요
  // 그냥 setDrivers 로 다 넣을겁니다.

  async function taxiDriversMarker() {
    try {
      // axios.get 호출을 await으로 기다립니다
      const response = await axios.get(
        "http://localhost:8000/taxiLocationFind/"
      );

      console.log("현재 갖고온 택시기사들 정보:", response.data);

      // 드라이버 정보를 상태에 저장
      setDrivers(response.data);

      // // 위치 정보를 추출하여 상태에 저장
      // const locations = response.data.map((driver) => ({
      //   latitude: parseFloat(driver.latitude),
      //   longitude: parseFloat(driver.longitude),
      // }));

      const locations = response.data.map((driver) => ({
        latitude: parseFloat(driver.latitude),
        longitude: parseFloat(driver.longitude),
      }));

      // setTaxiLocations(locations);

      // console.log("여기에 택시위치들 잘 들어왔음 ", locations);
    } catch (error) {
      console.log("error retrieving users", error);
    }
  }

  console.log("여기 드라이버들도 잘 들어왔음 ", drivers);

  const handleStartLocationChange = (value) => {
    console.log("설정될 출발지:", value);
    setStartPoint(value);
  };

  const handleEndLocationChange = (value) => {
    console.log("설정될 목적지:", value);
    setEndPoint(value);
  };

  const mapRef = useRef(null);
  // 초기 상태를 null에서 명시적으로 설정합니다.

  // 위도경도

  // 출발지 목적지 정하고 확인누르는 순간
  useEffect(() => {
    if (origin) {
      setMovingMarkerPosition(origin);
    }
  }, [origin]);

  // 맨첨 화면에서 권한설정받기
  useEffect(() => {
    // (async () => {
    //   let { status } = await Location.requestForegroundPermissionsAsync();
    //   if (status !== "granted") {
    //     setErrorMsg("Permission to access location was denied");
    //     return;
    //   }

    //   let location = await Location.getCurrentPositionAsync({});
    //   setLocation(location);
    // })();

    taxiDriversMarker(); // 받아온거를 이제 latitude , longitude 를 위도, 경도를 배열에 적재요.
  }, []);

  const MyCustomMarkerView = () => {
    return (
      <Image
        style={{ width: 30, height: 30 }}
        source={require("../../assets/carMarker.png")}
      />
    );
  };

  const MyCustomCalloutView = () => {
    return (
      <View>
        <Text>MyCustomCalloutVieww22</Text>
      </View>
    );
  };

  async function moveToLocation(latitude, longitude) {
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      2000
    );
  }

  const animateMarker = () => {
    let step = 0;
    const numSteps = routeCoordinates.length - 1;
    const interval = setInterval(() => {
      // 마커 위치를 업데이트합니다.
      if (step <= numSteps) {
        setMovingMarkerPosition(routeCoordinates[step]);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  };

  // 마커 클릭 시 이벤트 핸들러
  const handleMarkerPress = (driver) => {
    //
    setSelectedDriver(driver);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          firstLatitude,
          firstLongitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={true} // 사용자 위치 표시 활성화
        // 기본위치 바뀌는건데 잘못 했음. 연호가할거
      >
        {origin && (
          <Marker
            draggable
            coordinate={origin}
            onDragEnd={(e) =>
              console.log("출발지 드래그 좌표: ", e.nativeEvent.coordinate)
            }
          />
        )}
        {destination && (
          <Marker
            draggable
            coordinate={destination}
            onDragEnd={(e) =>
              console.log("목적지 드래그 좌표: ", e.nativeEvent.coordinate)
            }
          />
        )}
        {movingMarkerPosition && (
          <Marker coordinate={movingMarkerPosition}>
            <MyCustomMarkerView />
          </Marker>
        )}
        {origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeColor="blue"
            strokeWidth={2}
            onReady={(result) => {
              console.log(result.coordinates);
              setRouteCoordinates(result.coordinates);
              animateMarker();
            }}
          />
        )}

        {/* 택시 위치 마커들 */}

        {drivers.map((driver, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(driver.latitude),
              longitude: parseFloat(driver.longitude),
            }}
            onPress={() => handleMarkerPress(driver)} // 여기에서 driver 객체 전달
          >
            <MyCustomMarkerView />
          </Marker>
        ))}
      </MapView>
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          fetchDetails={true}
          placeholder="출발지"
          onPress={(data, details = null) => {
            if (details) {
              const { lat, lng } = details.geometry.location;
              setOrigin({ latitude: lat, longitude: lng });
              moveToLocation(lat, lng);
            }
            setStartPoint(data.description);
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: "ko",
          }}
          onFail={(error) => console.error(error)}
        />
        <GooglePlacesAutocomplete
          fetchDetails={true}
          placeholder="목적지"
          onPress={(data, details = null) => {
            if (details) {
              const { lat, lng } = details.geometry.location;
              setDestination({ latitude: lat, longitude: lng });
              moveToLocation(lat, lng);
            }
            setEndPoint(data.description);
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: "ko",
          }}
          onFail={(error) => console.error(error)}
        />
        <View style={styles.buttonWrapper}>
          <Button
            title="택시 호출"
            onPress={() => {
              console.log(
                "출발지 : ",
                startPoint,
                "\n",
                "목적지 : ",
                endPoint,
                "\n",
                "좌표: ",
                origin,
                "\n",
                "좌표: ",
                destination,
                "\n"
              );

              taxiDriversMarker(); // 이 함수는 택시 정보들을 갖고옴 갖고오고 마커로 찍을거임
            }}
            color="#28a745"
          />
        </View>
        {/* 그냥 서버로 userId랑 함께 날리면됨. */}

        {/* 출발지 도착지 입력하고 택시부르기 누르면 그냥 드라이버 한명 정해서 출발지, 목적지 보내줌  */}
        {/* 그리고 기달려야함? */}
      </View>

      {/* 모달 컴포넌트 */}
      {selectedDriver && (
        <Modal
          animationType="slide" // 슬라이드로나옴
          transparent={true} //
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <Driver item={selectedDriver} />
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  searchContainer: {
    position: "absolute",
    top: 40,
    width: "100%",
    padding: 10,
    backgroundColor: "white",
    zIndex: 1,
  },
  buttonWrapper: {
    flex: 1, // each button will take half of the container width
    borderRadius: 5, // slight roundness to the corners
    overflow: "hidden", // ensures the borderRadius is respected
  },

  showsUserLocation: {
    top: 400,
  },

  showsUserLocationButton: {
    position: "absolute", // 화면에 고정
    right: 10, // 오른쪽에서 10의 간격을 둠
    bottom: 10, // 하단에서 10의 간격을 둠
  },
});
