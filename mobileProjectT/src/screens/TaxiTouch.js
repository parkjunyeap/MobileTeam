import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { UserType } from "../UserContext";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import io from "socket.io-client";
import { registerIndieID, unregisterIndieDevice } from "native-notify";

export default function TaxiTouch() {
  const { userId, setUserId } = useContext(UserType);
  const [isDriving, setIsDriving] = useState(false); //일단 socket.io하기 전에 일단true
  const driverId = userId;
  const socket = io("http://10.20.34.180:8001");

  const [taxiRequests, setTaxiRequests] = useState([]); // 택시 요청 배열

  const [latitude, setLatitude] = useState(null); // 서버 디비에 보낼 위도
  const [longitude, setLongitude] = useState(null); // 경도

  const [location, setLocation] = useState(null); // 현재 지역  불러옴
  const [errorMsg, setErrorMsg] = useState(null); // 에러메시지 출력

  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    console.log("UserId:", userId);
    setUserId(userId);

    registerIndieID(userId, 16556, "EUD53vLmHh5vU3iX2Rph5g"); // 일단 이렇게만함 // 택시기사도 리뷰 남길 수는 있음.
  };

  // 운행 스위치 상태가 바뀔 때마다 실행되는 useEffect
  useEffect(
    () => {
      fetchUsers();

      socket.connect();
      socket.emit("driverConnect", driverId);

      //요청 받음
      socket.on("passengerRequestToDriver", (requestD) => {
        console.log("택시 요청이 도착했습니다.", requestD);
        setTaxiRequests((prevTaxiRequests) => [...prevTaxiRequests, requestD]);
        console.log(taxiRequests);
      });
      // 탑승자로부터의 요청을 처리하는 예시
      socket.on("passengerRequest", (request) => {
        console.log("탑승자로부터 요청을 받았습니다.", request);

        // 요청을 처리하고 응답을 보내는 코드 작성
      });

      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync(); // 위치 정보 불러오기 동의하냐??
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({}); // 현재 위치 받아오기
        setLocation(location); //

        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);

        console.log("이렇게 접근하는 게 아니야?", location.coords.latitude); // 위도
        console.log(location.coords.longitude); // 경도
        //z
        const driverLocation = {
          userId: userId,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        console.log("드라이버 로케이션", driverLocation);

        // axios
        //   .post("http://10.20.34.180:8000/taxiLocation", driverLocation) //
        //   .then((response) => {
        //     console.log("리스폰 ", response);
        //   })
        //   .catch((error) => {
        //     console.log("서버에 위치정보 오류", error);
        //   });
      })();

      return () => {
        socket.disconnect();
      };
    },
    [isDriving],
    [taxiRequests]
  ); // 의존성 배열에 isDriving을 넣어 상태 변경을 감지합니다.

  // 운행 스위치를 토글할 때 호출될 함수
  const toggleSwitch = async (newValue) => {
    try {
      setIsDriving(newValue); // 클라이언트 상태 업데이트
      const newDriveState = {
        userId: userId,
        driveState: newValue,
      };
      console.log(newDriveState);
      // 서버에 운전 상태 업데이트를 요청하고, 요청이 성공하면 클라이언트 상태 업데이트
      await axios.post("http://10.20.34.180:8000/UpDriveState", newDriveState);
    } catch (error) {
      console.error("운전 상태 업데이트 오류:", error);
    }
  };

  // 요청을 수락한 후 결제 내역 생성 및 저장
  const acceptRequest = async (request) => {
    console.log("택시 요청 수락", request);

    try {
      // 결제 내역을 생성
      const payment = {
        boarderId: request.userId, // 탑승자 ID
        driverId: driverId, // 택시 기사 ID
        startPoint: request.startPoint, // 출발지
        endPoint: request.endPoint, // 목적지
        pay: request.pay, // 결제 금액 설정
        payDate: request.requestDate,
      };

      axios
        .post("http://10.20.34.180:8000/Payment", payment) // 로컬호스트/8000번으로 레지스터 Url, user 객체를줌
        .then((response) => {
          // 요청이 성공적으로 처리될 때의 로직
          console.log("등록 성공:", response.data);
        })
        .catch((error) => {
          // 요청이 실패했을 때의 오류 처리
          console.error("등록 오류:", error);
        });

      // 요청을 수락한 후, 화면에서 해당 요청을 제거합니다.
      const updatedRequests = taxiRequests.filter(
        (item) => item.id !== request.id
      );
      setTaxiRequests(updatedRequests);

      // 서버에 요청 수락을 보냅니다.
      sendResponseToPassenger(request.userId, "accepted");
    } catch (error) {
      console.error("요청 수락 오류:", error);
    }
  };

  const rejectRequest = (request) => {
    console.log("택시 요청 거절");
    const updatedRequests = taxiRequests.filter(
      (item) => item.id !== request.id
    );
    setTaxiRequests(updatedRequests);
    sendResponseToPassenger(request.userId, "rejected");
  };

  const sendResponseToPassenger = (requestId, response) => {
    // 서버로 요청 ID와 응답 상태를 보냅니다.

    console.log(requestId, response);
    socket.emit("acceptRejectRequest", { requestId, status: response }); // 이게 말하느건데
  };

  return (
    <View style={styles.container}>
      {/* 헤더: 운행 텍스트 */}
      <Text style={styles.header}>운행</Text>

      {/* 택시 운행중 스위치와 레이블 */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>택시 Call Off</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDriving ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isDriving}
        />
        <Text style={styles.switchLabel}> On</Text>
      </View>
      <ScrollView style={{ width: "90%" }}>
        {/* 택시 요청 정보 카드 */}
        {isDriving &&
          taxiRequests.map((request) => (
            <View key={request.id} style={styles.infoCard}>
              <Text style={styles.distance}>
                출발지와 목적지 사이의 거리 : {`${request.distance}`} Km
              </Text>
              <Text style={styles.route}>{`${request.startPoint}`}</Text>
              <Text style={styles.route}> ↓ </Text>
              <Text style={styles.route}>{`${request.endPoint}`}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => acceptRequest(request)}
                >
                  <Text style={styles.buttonText}>수락</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => rejectRequest(request)}
                >
                  <Text style={styles.buttonText}>거절</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

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
  // 새로고침 버튼 스타일
  refreshButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20, // 버튼과 스위치 사이 간격 조절
  },
  refreshButtonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});
