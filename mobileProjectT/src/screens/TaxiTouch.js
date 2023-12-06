import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { UserType } from '../UserContext';
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import io from 'socket.io-client';

const TaxiTouch = () => {
  const { userId, setUserId } = useContext(UserType);
  const [isDriving, setIsDriving] = useState(false);//일단 socket.io하기 전에 일단true
  const [taxiRequest, setTaxiRequest] = useState(null);
  const driverId = userId;
  const socket = io("http://192.168.219.104:8001");

  const [taxiRequests, setTaxiRequests] = useState([]);

  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    console.log("UserId:", userId);
    setUserId(userId);

  };

  // 운행 스위치 상태가 바뀔 때마다 실행되는 useEffect
  useEffect(() => {
    socket.connect();
    socket.emit('driverConnect', driverId);

    //요청 받음
    socket.on('passengerRequestToDriver', (requestD) => {
      console.log('택시 요청이 도착했습니다.', requestD);
      setTaxiRequests((prevTaxiRequests) => [...prevTaxiRequests, requestD]);
      console.log(taxiRequests)
    })
    // 탑승자로부터의 요청을 처리하는 예시
    socket.on('passengerRequest', (request) => {
      console.log('탑승자로부터 요청을 받았습니다.', request);

      // 요청을 처리하고 응답을 보내는 코드 작성
    });


    if (isDriving) {
      // 백엔드에서 데이터를 가져오는 것으로 가정
      setTaxiRequest({
        distance: '6.5KM',
        pickup: '백화점',
        dropoff: '시민공원',
      });
    } else {
      setTaxiRequest(null);
    }
    fetchUsers();

    return () => {
      socket.disconnect();
    }
  }, [isDriving],[taxiRequests]); // 의존성 배열에 isDriving을 넣어 상태 변경을 감지합니다.

  // 운행 스위치를 토글할 때 호출될 함수
  const toggleSwitch = async (newValue) => {
    try {
      const newDriveState = {
        userId: userId,
        isDriving: newValue
      }
      console.log(newDriveState)
      // 서버에 운전 상태 업데이트를 요청하고, 요청이 성공하면 클라이언트 상태 업데이트
      await axios
        .post("http://192.168.219.104:8000/UpDriveState", newDriveState)
      setIsDriving(newValue); // 클라이언트 상태 업데이트
    } catch (error) {
      console.error('운전 상태 업데이트 오류:', error);
    }
  };

  const acceptRequest = (request) => {
    console.log('택시 요청 수락',request);
    //setIsDriving(false);
    sendResponseToPassenger(request.userId, 'accepted');
  };

  const rejectRequest = (request) => {
    console.log('택시 요청 거절');
    const updatedRequests = taxiRequests.filter((item) => item.id !== request.id);
    setTaxiRequests(updatedRequests);
    sendResponseToPassenger(request.userId, 'rejected');
  };

  const sendResponseToPassenger = (requestId, response) => {
    // 서버로 요청 ID와 응답 상태를 보냅니다.
    console.log(requestId,response)
    socket.emit('acceptRejectRequest', { requestId, status: response });
  };

  return (
    <View style={styles.container}>
      {/* 헤더: 운행 텍스트 */}
      <Text style={styles.header}>운행</Text>

      {/* 택시 운행중 스위치와 레이블 */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>택시 Call      Off</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDriving ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isDriving}
        />
        <Text style={styles.switchLabel}>     On</Text>
      </View>
      <ScrollView style={{ width: '90%' }}>
        {/* 택시 요청 정보 카드 */}
        {isDriving && taxiRequests.map((request) => (
          <View key={request.id} style={styles.infoCard}>
            <Text style={styles.distance}>{`${request.distance}`} Km</Text>
            <Text style={styles.route}>{`${request.startPoint}`}</Text>
            <Text style={styles.route}> ↓ </Text>
            <Text style={styles.route}>{`${request.endPoint}`}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => acceptRequest(request)}>
                <Text style={styles.buttonText}>수락</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => rejectRequest(request)}>
                <Text style={styles.buttonText}>거절</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// ... 스타일 정의 ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50, // 상단에 여백 추가
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, // 스위치와의 간격
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  distance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4, // 거리와 경로 사이 간격
  },
  route: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10, // 경로와 버튼 사이 간격
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // 버튼을 카드 너비에 맞춤
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10, // 버튼 사이 간격
  },
  acceptButton: {
    backgroundColor: '#4CAF50', // 수락 버튼 색상
  },
  rejectButton: {
    backgroundColor: '#F44336', // 거절 버튼 색상
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  // 새로고침 버튼 스타일
  refreshButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20, // 버튼과 스위치 사이 간격 조절
  },
  refreshButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default TaxiTouch;