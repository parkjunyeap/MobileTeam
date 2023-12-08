import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { UserType } from "../UserContext";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";

const TaxiTouch = () => {
  const { userId, setUserId } = useContext(UserType);
  const [isDriving, setIsDriving] = useState(false);
  const [taxiRequest, setTaxiRequest] = useState(null);

  const [latitude, setLatitude] = useState(null); // 서버 디비에 보낼 위도
  const [longitude, setLongitude] = useState(null); // 경도

  const [location, setLocation] = useState(null); // 현재 지역  불러옴
  const [errorMsg, setErrorMsg] = useState(null); // 에러메시지 출력

  useEffect(() => {}, []); // useEffect의 두 번째 매개변수는 빈 배열로 유지합니다.

  //

  // 위치 경도

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  console.log(text);
  // 운행 스위치 상태가 바뀔 때마다 실행되는 useEffect
  useEffect(() => {
    const fetchUsers = async () => {
      // console.log("함수가 잘임폴트됐는지", MaterialIcons);
      // console.log("jwtDecode 이거임폴트가안되네", jwt_decode);
      // // 잘되는지
      // console.log(AsyncStorage, "그냥함수자체가 import 잘됐는지?");

      const token = await AsyncStorage.getItem("authToken");
      // console.log("홈에선 토큰이있는데 Token:", token);
      // console.log("decoded 토큰 접근");
      const decodedToken = jwt_decode(token);
      // console.log(
      //   "여기에서 디코드 토큰이 만들어졌어야하는건데 안됐으면 jwt_decode가 안돌아가는거네"
      // );
      //console.log("Decoded Token:", decodedToken);
      const userId = decodedToken.userId;
      console.log("UserId:", userId);
      setUserId(userId);

      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);

        console.log("이렇게 접근하는 게 아니야?", location.coords.latitude); // 위도
        console.log(location.coords.longitude); // 경도

        const driverLocation = {
          userId: userId,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        console.log("드라이버 로케이션", driverLocation);

        axios
          .post("http://172.30.1.76:8000/taxiLocation", driverLocation) //
          .then((response) => {
            console.log("리스폰 ", response);
          })
          .catch((error) => {
            console.log("서버에 위치정보 오류", error);
          });
      })();
    };
    if (isDriving) {
      // 백엔드에서 데이터를 가져오는 것으로 가정
      setTaxiRequest({
        distance: "6.5KM",
        duration: "11분",
        pickup: "백화점",
        dropoff: "시민공원",
      });
    } else {
      setTaxiRequest(null);
    }
    fetchUsers();
  }, [isDriving]); // 의존성 배열에 isDriving을 넣어 상태 변경을 감지합니다.

  // 운행 스위치를 토글할 때 호출될 함수
  const toggleSwitch = () => {
    setIsDriving((previousState) => !previousState);
  };

  const acceptRequest = () => {
    console.log("택시 요청 수락");
  };

  const rejectRequest = () => {
    console.log("택시 요청 거절");
  };

  return (
    <View style={styles.container}>
      {/* 헤더: 운행 텍스트 */}
      <Text style={styles.header}>운행</Text>

      {/* 택시 운행중 스위치와 레이블 */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>택시 운행중</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDriving ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isDriving}
        />
      </View>

      {/* 택시 요청 정보 카드 */}
      {isDriving && taxiRequest && (
        <View style={styles.infoCard}>
          <Text
            style={styles.distance}
          >{`${taxiRequest.distance} ${taxiRequest.duration}`}</Text>
          <Text
            style={styles.route}
          >{`${taxiRequest.pickup}  ${taxiRequest.dropoff}`}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={acceptRequest}
            >
              <Text style={styles.buttonText}>수락</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={rejectRequest}
            >
              <Text style={styles.buttonText}>거절</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// ... 스타일 정의 ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50, // 상단에 여백 추가
    backgroundColor: "#F5FCFF",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20, // 스위치와의 간격
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  infoCard: {
    width: "90%", // 카드 너비
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  distance: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4, // 거리와 경로 사이 간격
  },
  route: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10, // 경로와 버튼 사이 간격
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%", // 버튼을 카드 너비에 맞춤
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10, // 버튼 사이 간격
  },
  acceptButton: {
    backgroundColor: "#4CAF50", // 수락 버튼 색상
  },
  rejectButton: {
    backgroundColor: "#F44336", // 거절 버튼 색상
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
});

export default TaxiTouch;
