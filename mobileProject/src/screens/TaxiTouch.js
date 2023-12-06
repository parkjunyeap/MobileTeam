import { StyleSheet, Text, View, TouchableOpacity,Alert } from "react-native";
import { UserType } from "../UserContext";
import { useContext, useEffect } from "react";
import io from 'socket.io-client';

// import { MapView } from "react-native-maps";
const TaxiTouch = () => {
  const { userId, setUserId } = useContext(UserType);
  console.log(userId)
  const passengerId = userId
  const socket = io("http://192.168.219.104:8001");

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
    distance: "5"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  maps: {
    width: 100,
    height: 100,
  },
});

export default TaxiTouch;
