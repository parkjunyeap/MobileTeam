import React, { useState, useEffect, useRef } from "react";
import { View, Image, Text, StyleSheet, SafeAreaView } from "react-native";
import MapView, { Callout, PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "../config/constants";
import MapViewDirections from "react-native-maps-directions";

export default function GoogleMapsScreen() {
  const mapRef = useRef(null);
  // 초기 상태를 null에서 명시적으로 설정합니다.
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [movingMarkerPosition, setMovingMarkerPosition] = useState(null);

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
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: "ko",
          }}
          onFail={(error) => console.error(error)}
        />
      </View>
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
    top: 50,
    width: "100%",
    padding: 10,
    backgroundColor: "white",
    zIndex: 1,
  },
});
