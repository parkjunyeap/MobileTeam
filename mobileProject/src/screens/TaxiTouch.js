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

import { UserType } from "../UserContext";

export default function GoogleMapsScreen() {
  const [startPoint, setStartPoint] = useState(""); // 입력한 출발지
  const [endPoint, setEndPoint] = useState(""); // 입력한 목적지.

  const { userId, setUserId } = useContext(UserType); // 로그인한 유저

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
  const [origin, setOrigin] = useState(null); // 좌표값
  const [destination, setDestination] = useState(null); // 좌표값 설정
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [movingMarkerPosition, setMovingMarkerPosition] = useState(null);

  // 출발지 목적지 정하고 확인누르는 순간
  useEffect(() => {
    if (origin) {
      setMovingMarkerPosition(origin);
    }
  }, [origin]);

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
          latitude: 36.47,
          longitude: 127.43,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
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
});
