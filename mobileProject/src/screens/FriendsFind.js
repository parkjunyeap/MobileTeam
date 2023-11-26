import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  FlatList,
} from "react-native";
// ... 나머지 코드
// Dummy data array
import socket from "../server"

const dummyData = [
  {
    id: "1",
    name: "유재석",
    province: "충청남도",
    city: "아산시",
    startLocation: "출발지1",
    endLocation: "도착지1",
    time1: { hour: "08", minute: "30" },
    time2: { hour: "18", minute: "00" },
  },
  {
    id: "2",
    name: "노홍철",
    province: "서울특별시",
    city: "강남구",
    startLocation: "출발지2",
    endLocation: "도착지2",
    time1: { hour: "09", minute: "00" },
    time2: { hour: "17", minute: "30" },
  },
  // ... more friends
];

const FriendsFind = ({ route,navigation }) => {
  const { userData } = route.params;
  const [friends, setFriends] = useState(dummyData); // // 서버에서 데이터를 가져와야 할 곳
  const renderFriendDetail = (
    { item } // 친구 상세정보 보여주기 위한 렌더링
  ) => (
    <View style={styles.friendDetailContainer}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>도: {item.province}</Text>
      <Text>시: {item.city}</Text>
      <Text>즐겨타는 출발지: {item.startLocation}</Text>
      <Text>즐겨타는 도착지: {item.endLocation}</Text>
      <Text>
        즐겨타는 시간대 1: {item.time1.hour}:{item.time1.minute}
      </Text>
      <Text>
        즐겨타는 시간대 2: {item.time2.hour}:{item.time2.minute}
      </Text>

      {/* 여기에 친구 추가 버튼 추가 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          /* 친구 추가 로직 */
        }}
      >
        <Text style={styles.addButtonText}>친구 추가</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAddFriendButton = () => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        /* 친구 추가 로직 */
      }}
    >
      <Text style={styles.buttonText}>친구 추가</Text>
    </TouchableOpacity>
  );

  return (
    // 친구 찾기 누르면 친구 찾기 페이지로 이동
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("FriendsFindDetail")}
      >
        <Text style={styles.buttonText}>친구 찾기</Text>
      </TouchableOpacity>

      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={renderFriendDetail}
        // ListFooterComponent={renderAddFriendButton} // Footer로 버튼 추가
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    // Match the style with your design
    backgroundColor: "#4CAF50", // This is the green background
    padding: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    // Add other styles for your text if needed
  },
  friendDetailContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  name: {
    fontWeight: "bold",
  },
  addButton: {
    // 버튼 스타일을 여기에 맞추세요
    backgroundColor: "#FFA07A", // 색상 예시
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    // 필요하다면 텍스트 스타일 추가
  },
});

export default FriendsFind;
