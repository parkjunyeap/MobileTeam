// 선택한 친구의 리뷰 보여지는 화면

import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, Text, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native"; // useRoute를 통해 데이터를받아올 수 있다.
import axios from "axios";

import ReviewItem from "../components/ReviewItem";
const ViewFriendReview = () => {
  //   const { userId } = useContext(UserType);
  const [reviews, setReviews] = useState([]); // 리뷰 데이터 상태
  // const navigation = useNavigation();
  const route = useRoute(); // 현재 라우트에 대한 정보를 가져옵니다.

  const selectedUserId = route.params?.selectedUserId; // 사용자 ID
  const selectedUserName = route.params?.selectedUserName; // 사용자 이름
  const selectedDriverId = route.params?.selectedDriverId; // 기사 ID
  const selectedDriverName = route.params?.selectedDriverName; // 기사 이름

  // const [selectedUserName, setSelectedUserNamet] = useState("");
  console.log("선택한 아이디가 유저냐 뷰리뷰 ", selectedUserId);
  console.log("선택한 아이디가 드라이버냐 뷰리뷰", selectedDriverId);

  // const receiverId = selectedDriverId || selectedUserId;

  // useEffect(() => {
  //   // 컴포넌트가 마운트되면 리뷰 데이터를 요청합니다.
  //   const fetchReviewRequest = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://10.20.60.238:8000/reviews/receiver/${selectedUserId}`
  //       );
  //       if (response.status === 200) {
  //         setReviews(response.data); // 서버로부터 받은 데이터를 상태에 저장합니다.
  //       }
  //     } catch (err) {
  //       console.error("리뷰 데이터를 가져오는 데 실패했습니다.", err);
  //     }
  //   };

  //   fetchReviewRequest();
  // }, []); // userId가 바뀔 때마다 리뷰를 다시 요청합니다.

  useEffect(() => {
    // 컴포넌트가 마운트되면 리뷰 데이터를 요청합니다.
    const fetchReviewRequest = async () => {
      try {
        let apiUrl;
        if (selectedDriverId) {
          // 드라이버에 대한 리뷰를 요청하는 경우
          apiUrl = `http://10.20.60.238:8000/reviews/receiver/driver/${selectedDriverId}`;
        } else if (selectedUserId) {
          // 사용자에 대한 리뷰를 요청하는 경우
          apiUrl = `http://10.20.60.238:8000/reviews/receiver/user/${selectedUserId}`;
        } else {
          console.log("선택된 ID가 없습니다.");
          return;
        }

        const response = await axios.get(apiUrl);
        if (response.status === 200) {
          setReviews(response.data); // 서버로부터 받은 데이터를 상태에 저장합니다.
        }
      } catch (err) {
        console.error("리뷰 데이터를 가져오는 데 실패했습니다.", err);
      }
    };

    fetchReviewRequest();
  }, [selectedUserId, selectedDriverId]); // userId 또는 driverId가 바뀔 때마다 리뷰를 다시 요청합니다.

  return (
    <View>
      {/* <Text style={styles.emptyListStyle}>
        {selectedDriverName || selectedUserName}님 리뷰입니다.
      </Text> */}
      <FlatList
        data={reviews} // 서버로부터 받은 리뷰 데이터를 사용합니다.
        renderItem={({ item }) => <ReviewItem item={item} />}
        keyExtractor={(item) => item._id.toString()} // MongoDB의 _id를 사용합니다.
        ListEmptyComponent={
          <Text style={styles.emptyListStyle}>
            <Text style={styles.boldText}>
              {selectedDriverName || selectedUserName}
            </Text>
            님의 리뷰가 하나도 없습니다.
          </Text>
        } // 여기에 추가
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // ...
  emptyListStyle: {
    textAlign: "center", // 텍스트를 가운데 정렬합니다.
    marginTop: 20, // 위쪽 여백을 추가합니다.
    fontSize: 16, // 텍스트 크기를 지정합니다.
    // 필요한 경우 추가 스타일을 여기에 추가할 수 있습니다.
  },
  boldText: {
    fontWeight: "bold", // 볼드 스타일 적용
  },
});

export default ViewFriendReview;
