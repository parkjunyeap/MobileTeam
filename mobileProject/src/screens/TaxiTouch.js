import io from "socket.io-client";

import React, { useState, useEffect, useRef, useContext } from "react";
import {
  TouchableOpacity,
  Alert,
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  Modal,
  Pressable,
} from "react-native";
import MapView, { Callout, PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "../config/constants";
import MapViewDirections from "react-native-maps-directions";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Driver from "../components/Driver";
import * as Location from "expo-location";
// 드라이버 객체 모달창 나오게 하기 위해서
import Geolocation from "react-native-geolocation-service";
import { UserType } from "../UserContext";

// import { MapView } from "react-native-maps";
export default TaxiTouch = () => {
  const navigation = useNavigation(); // 네비게이션 쓰겠다;;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // 필요한 로직 추가
      setIsModalVisible(false); // 모달 상태를 비활성화
    });

    // 화면을 떠날 때 모달 꺼지게.
    return unsubscribe;
  }, [navigation]);

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

  const autocompleteRef = useRef(null);

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
  const [drivers, setDrivers] = useState([]);
  // 택시 드라이버 배열
  //

  // 모달이 보이냐

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
  const [routeInfo, setRouteInfo] = useState({
    distance: "",
    duration: null,
  });

  console.log(userId);
  const passengerId = userId;
  const socket = io("http://10.20.34.180:8001");

  // 아이템 선택 및 모달 표시 함수
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  // 모달을 닫는 함수
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 Socket.io 서버에 연결합니다.
    socket.connect();
    // 탑승자 연결 이벤트를 서버로 전송
    socket.emit("passengerConnect", passengerId);
    // 탑승자가 서버로부터 메시지를 받을 때

    socket.on("acceptRejectRequestToPassenger", (message) => {
      console.log("운전사의 응답을 받았습니다.", message);
      const { requestId, status } = message;

      if (status === "accepted") {
        Alert.alert("요청 수락", "운전사가 요청을 수락했습니다.");
        console.log("운전사가 요청을 수락했습니다.");
      } else if (status === "rejected") {
        Alert.alert("요청 거절", "운전사가 요청을 거절했습니다.");
        console.log("운전사가 요청을 거절했습니다.");
      }
    });
    // 컴포넌트가 언마운트될 때 연결을 해제합니다.
    return () => {
      socket.disconnect();
    };
  }, []);

  // const requestD = {
  //   userId: userId,
  //   driverId: selectedDriver,
  //   startPoint: startPoint,
  //   endPoint: endPoint,
  //   requestDate: new Date(), // 날짜 더미데이터??
  //   pay: "10000",
  //   distance: "0.5",
  // };

  const payCalc =
    4000 +
    (routeCoordinates.distance > 1.4
      ? 0.12 * (routeCoordinates.distance - 1.4)
      : 0);

  const requestD = {
    userId: userId,
    driverId: selectedDriver,
    startPoint: startPoint,
    endPoint: endPoint,
    requestDate: new Date(), // 날짜 더미데이터??
    pay: payCalc,
    distance: routeInfo.distance,
  };

  // userId,
  // selectedDriver._id,
  // startPoint,
  // endPoint

  //서버로 전달
  const requestDtoS = () => {
    //
    // 리퀘스트 데이터 투 서버
    console.log("임시 데이터 확인 :", requestD);
    socket.emit("passengerRequest", requestD);
    Alert.alert("호출!!", "택시를 호출하였습니다");
  };

  // 택시 위치 정보들 갖고오는 함수요
  // 그냥 setDrivers 로 다 넣을겁니다.

  async function taxiDriversMarker() {
    try {
      // axios.get 호출을 await으로 기다립니다
      const response = await axios.get(
        "http://10.20.34.180:8000/taxiLocationFind/"
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

  // console.log("여기 드라이버들도 잘 들어왔음 ", drivers);

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

  useEffect(() => {
    getCurrentLocation();
  }, []);
  // 위도경도

  // 출발지 목적지 정하고 확인누르는 순간
  useEffect(() => {
    if (origin) {
      setCarMarkerPosition(origin);
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

  // 연호가 현재 지도

  // 차량 마커 위치를 위한 상태
  const [carMarkerPosition, setCarMarkerPosition] = useState(null);
  // 애니메이션을 위한 인터벌 참조
  const animationInterval = useRef(null);

  async function getCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setOrigin({ latitude, longitude });
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        2000
      );

      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      const address = addressResponse[0];
      if (address) {
        const formattedAddress = `${address.street}, ${address.city}, ${address.region}, ${address.postalCode}, ${address.country}`;
        if (autocompleteRef.current) {
          autocompleteRef.current.setAddressText(formattedAddress);
        }
      }
    } catch (error) {
      console.error("Error getting current location", error);
    }
  }

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

  function animateCarMarker(coordinates, duration) {
    let step = 0;
    const numSteps = coordinates.length - 1;

    // 경로의 각 단계 사이의 시간 간격을 계산합니다.
    // duration은 분 단위로 제공되므로, 밀리초 단위로 변환합니다.
    const intervalTime = (duration * 60 * 1000) / numSteps;

    const interval = setInterval(() => {
      if (step < numSteps) {
        setCarMarkerPosition(coordinates[step]);
        step++;
      } else {
        clearInterval(interval);
      }
    }, intervalTime);
  }

  // 마커 클릭 시 이벤트 핸들러
  const handleMarkerPress = (driver) => {
    //
    setSelectedDriver(driver);
    setIsModalVisible(true);
  };

  handleCallButton = () => {
    axios.post();
  };
  // requestDtos // 이거 서버로 정보넘기는거
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
        {carMarkerPosition && (
          <Marker coordinate={carMarkerPosition}>
            <Image
              source={require("../../assets/carMarker.png")}
              style={styles.carMarker}
            />
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
              animateCarMarker(result.coordinates);

              // 경로 정보 업데이트
              setRouteInfo({
                distance: result.distance, // 거리 (km)
                duration: result.duration, // 소요 시간 (분)
              });
              // 애니메이션 시작
              animateCarMarker(result.coordinates, result.duration);
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
            onPress={() => handleMarkerPress(driver)}
          >
            <Image
              source={require("../../assets/carMarker.png")}
              style={{ width: 40, height: 40 }} // 여기서 이미지 크기를 조절합니다.
            />
          </Marker>
        ))}
      </MapView>
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          ref={autocompleteRef} // ref 가뭔데?? 추가
          fetchDetails={true}
          placeholder="출발지"
          onPress={(data, details = null) => {
            if (details) {
              const { lat, lng } = details.geometry.location;
              setOrigin({ latitude: lat, longitude: lng });
              // moveToLocation(lat, lng);

              mapRef.current.animateToRegion(
                {
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                },
                2000
              );
            }

            setStartPoint(data.description);
            // 이거해주면 시작점으로 감
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: "ko",
          }}
          styles={{
            container: { flex: 0 },
            textInput: { paddingLeft: 20, height: 40 },
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

              if (origin && details) {
                // 지도가 출발지와 목적지를 모두 포함하도록 조정
                mapRef.current.fitToCoordinates(
                  [origin, { latitude: lat, longitude: lng }],
                  {
                    edgePadding: {
                      top: 150,
                      right: 100,
                      bottom: 100,
                      left: 100,
                    },
                    animated: true,
                  }
                );
              }
            }
            setEndPoint(data.description);
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: "ko",
          }}
          onFail={(error) => console.error(error)}
        />

        <View>
          {routeInfo.distance && routeInfo.duration && (
            <Text>
              거리: {routeInfo.distance.toFixed(2)} km, 시간:{" "}
              {Math.round(routeInfo.duration)} 분
            </Text>
          )}
        </View>

        {/* 그냥 서버로 userId랑 함께 날리면됨. */}

        {/* 출발지 도착지 입력하고 택시부르기 누르면 그냥 드라이버 한명 정해서 출발지, 목적지 보내줌  */}
        {/* 그리고 기달려야함? */}
      </View>

      {/* 모달 컴포넌트 */}

      {/* 모달 창 띄울거를 갖고 와야될것 같음  */}
      {selectedDriver && (
        // <Modal
        //   animationType="slide" // 슬라이드로나옴
        //   transparent={true} //
        //   visible={isModalVisible}
        //   onRequestClose={() => setIsModalVisible(false)}
        // >
        //   <Driver item={selectedDriver} />
        // </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                    resizeMode: "cover",
                  }}
                  source={{ uri: selectedDriver?.image }}
                  // ㅇ처음엔 사진
                />
              </View>
              <Text style={styles.modalText}> {selectedDriver.name}</Text>

              <Text> 이메일 : {selectedDriver.email}</Text>

              <Text>
                운행하시는 동네 :
                {selectedDriver.province === undefined &&
                selectedDriver.city === undefined
                  ? "입력안함"
                  : selectedDriver.province + " " + selectedDriver.city}
              </Text>

              <Text>
                차량 번호 :
                {selectedDriver.carNumber === undefined
                  ? "입력안함"
                  : selectedDriver.carNumber}
              </Text>

              <Text>
                차종 :
                {selectedDriver.carName === undefined
                  ? "입력안함"
                  : selectedDriver.carName}
              </Text>
              <Text>
                자격증명넘버 :
                {selectedDriver.licenseNumber === undefined
                  ? "입력안함"
                  : selectedDriver.licenseNumber}
              </Text>
              <Text>
                자격증 습득 날짜 :
                {selectedDriver.getDate === undefined
                  ? "입력안함"
                  : selectedDriver.getDate}
              </Text>

              <Text>
                운행 상태 :
                {selectedDriver.driveState === true ? "운행중" : "쉬는중"}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonClose,
                    { marginRight: 10, marginTop: 10 },
                    // !userFriends.includes(item._id) && styles.buttonDisabled, // 친구가 아닐 때 스타일 추가
                  ]}
                  onPress={() => {
                    navigation.navigate("writeReview", {
                      selectedDriverId: selectedDriver._id, // 사실 드라이버 아이디 ,
                      selectedDriverName: selectedDriver.name, //사실 드라이버 이름
                    });
                  }}
                >
                  <Text style={styles.textStyle}>리뷰 남기기</Text>
                  {/* 리뷰 남기기는 되는것같은데??? */}
                </Pressable>

                {/*  여기 서부터하자 */}

                <Pressable
                  style={[
                    styles.button,
                    styles.buttonClose,
                    { marginRight: 10, marginTop: 10 },
                  ]}
                  onPress={() =>
                    navigation.navigate("ViewFriendReview", {
                      // 뷰 프렌드 리뷰로 감 일단 //
                      selectedDriverId: selectedDriver._id, // 이렇게하면 지금 selectedUserId 도 보내줄 // 사실 드라이버 아이디 ,
                      selectedDriverName: selectedDriver.name, // 선택한 아이템의 이름도 보내줌 //사실 드라이버 이름
                    })
                  }
                >
                  <Text style={styles.textStyle}>리뷰 보기</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonClose, { marginTop: 10 }]}
                  onPress={() =>
                    navigation.navigate("BookingTaxiDriver", {
                      // 뷰 프렌드 리뷰로 감 일단 //
                      selectedDriverId: selectedDriver._id, // 이렇게하면 지금 selectedUserId 도 보내줄 // 사실 드라이버 아이디 ,
                      selectedDriverName: selectedDriver.name, // 선택한 아이템의 이름도 보내줌 //사실 드라이버 이름
                    })
                  }
                >
                  <Text style={styles.textStyle}>예약</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.button,
                    styles.buttonCast,
                    { marginLeft: 10, marginTop: 10 },
                  ]}
                  onPress={() => {
                    console.log(
                      userId,
                      selectedDriver._id,
                      startPoint,
                      endPoint
                    );

                    requestDtoS();
                  }}
                >
                  <Text style={styles.textStyle}> 호출 </Text>
                </Pressable>
              </View>

              {/* // 그냥 닫기 */}
              <Pressable
                style={[
                  styles.button,
                  styles.buttonCloseRed,
                  ,
                  { marginTop: 10 },
                ]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.textStyle}>닫기</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>

    // <View style={styles.container}>
    //   {/* <MapView style={styles.maps} /> */}
    //   <Text> 택시맵 </Text>
    //   <TouchableOpacity
    //     onPress={requestDtoS}
    //   >
    //     <Text>요청</Text>
    //   </TouchableOpacity>
    // </View>
  );
};

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
    top: 25,
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

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  buttonCloseRed: {
    backgroundColor: "#DC143C ",
  },

  buttonCast: {
    backgroundColor: "#ff7f00",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  carMarker: {
    width: 30,
    height: 30,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
