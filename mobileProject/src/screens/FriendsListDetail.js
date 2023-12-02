// 현재 안쓸 예정인 화면
// 안씀요
import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";

const FriendsListDetail = () => {
  //   const { friendId, friendName } = route.params;
  // const { friendId, friendName } = route.params;
  //   const [friendData, setFriendData] = useState("null");

  // 이렇게 하는건 props 만 줘
  //   이건 서버 에서 데이터 받아오는건데
  //   useEffect(() => {
  //     fetchFriendData(friendId);
  //   }, [friendId]);

  //   const fetchFriendData = async (id) => {
  //     try {
  //       const response = await fetch(`https://example.com/api/friends/${id}`);
  //       const data = await response.json();
  //       setFriendData(data);
  //     } catch (error) {
  //       console.error("Error fetching friend data:", error);
  //     }
  //   };

  //   if (!friendData) {
  //     return <Text>Loading...</Text>;
  //   }

  // 더미 데이터
  const selectedProvince = "충청남도";
  const selectedCity = "아산시";
  const favoriteStartLocation = "서울역";
  const favoriteEndLocation = "인천공항";
  const favoriteTime1 = { hour: "08", minute: "30" };
  const favoriteTime2 = { hour: "18", minute: "00" };

  return (
    <View>
      <View>
        <Text>택시 동승자 정보</Text>
        {/* <Text>친구 ID: {friendId}</Text>
        <Text>친구 이름: {friendName}</Text> */}

        <Text> 택시를 이용하는 지역</Text>
        <Text>도 : {selectedProvince}</Text>
        <Text>시 : {selectedCity}</Text>

        <Text> 즐겨타는 출발지 : {favoriteStartLocation}</Text>
        <Text> 즐겨타는 목적지 : {favoriteEndLocation}</Text>

        <Text>
          {" "}
          즐겨타는 시간대 1: {favoriteTime1.hour}:{favoriteTime1.minute}
        </Text>
        <Text>
          {" "}
          즐겨타는 시간대 2: {favoriteTime2.hour}:{favoriteTime2.minute}
        </Text>

        {/* 여기에 추가적인 UI 요소를 배치할 수 있습니다. */}
      </View>

      {/* 버튼 style 먹이느라 */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="리뷰남기기" onPress={() => {}} color="#28a745" />
        </View>
        <View style={{ width: 20 }} />
        <View style={styles.buttonWrapper}>
          <Button title="채팅하러가기" onPress={() => {}} color="#28a745" />
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="리뷰보기" onPress={() => {}} color="#28a745" />
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="친구 삭제" onPress={() => {}} color="#28a745" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    height: 50,
    width: 250,
    marginBottom: 20, // Picker들 사이의 간격을 조정
  },

  location: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    // borderBottomColor : GRAY.LIGHT,
  },
  locationIcon: {
    position: "absolute",
    left: 20,
    top: 16,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  buttonWrapper: {
    flex: 1, // each button will take half of the container width
    borderRadius: 5, // slight roundness to the corners
    overflow: "hidden", // ensures the borderRadius is respected
  },
});

export default FriendsListDetail;
