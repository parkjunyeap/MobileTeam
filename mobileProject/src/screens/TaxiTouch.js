import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
} from "react-native";
import MapView, { Callout, PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "../config/constants";
import MapViewDirections from "react-native-maps-directions";
import axios from "axios";

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
  function taxiDriversMarker() {
    // 드라이버 위치정보 모두 갖고와서 locations 배열에 담아주기.
    axios
      .get("http://172.30.1.76:8000/taxiLocationFind/") // 본인아이디넘겨서 본인만 빼고 나오게 만듦.
      .then((response) => {
        console.log("현재 갖고온 택시기사들 정보:", response.data); // 전부 찍힘.

        const locations = response.data.map((driver) => ({
          latitude: driver.latitude,
          longitude: driver.longitude,
        }));

        console.log(locations);
        // 이거는 이제 지도에 마커만 찍으려고 하는거 ...
        setTaxiLocations(locations);

        console.log("여기에 택시위치들 잘 들어왔음 ", taxiLocations);

        // setUsers(response.data);
      })
      .catch((error) => {
        console.log("error retrieving users", error);
      });

    // 마커에 찍혀아함니다.
  }

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
        {taxiLocations.map((location, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude),
            }}
            // 추가적으로 필요한 Marker 속성들
          />
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
