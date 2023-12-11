// 내가 친구에게 쓴 리뷰 확인하는 화면

import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { UserType } from "../UserContext";
import axios from "axios";

import ReviewItem from "../components/ReviewItem";
const ViewWrittenMyReview = () => {
  const { userId } = useContext(UserType);
  const [reviews, setReviews] = useState([]); // 리뷰 데이터 상태

  // 리뷰 삭제
  const deleteReview = async (writeId) => {
    try {
      // 사용자에게 예약 취소를 확인
      Alert.alert(
        "리뷰 삭제", // 제목
        "리뷰를 삭제하시겠습니까?", // 메시지
        [
          {
            text: "취소",
            onPress: () => console.log("취소됨"),
            style: "cancel",
          },
          {
            text: "확인", // 확인누르면
            onPress: async () => {
              await axios.delete(`http://localhost:8000/Review/del/${writeId}`);
              setBooking((prevReviews) =>
                prevReviews.filter((b) => b._id !== writeId)
              );
              alert("성공적으로 예약을 취소하였습니다.");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (err) {
      console.error("Error deleting Review:", err);
    }
  };

  // 유저아이디 갖고온거를 senderId랑 비교함.
  useEffect(() => {
    // 컴포넌트가 마운트되면 리뷰 데이터를 요청합니다.
    const fetchReviewRequest = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/reviews/sender/${userId}``http://localhost:8000/reviews/sender/${userId}`
        );
        if (response.status === 200) {
          setReviews(response.data); // 서버로부터 받은 데이터를 상태에 저장합니다.
        }
      } catch (err) {
        console.error("리뷰 데이터를 가져오는 데 실패했습니다.", err);
      }
    };

    fetchReviewRequest();
  }, [userId]); // userId가 바뀔 때마다 리뷰를 다시 요청합니다.

  return (
    <FlatList
      data={reviews} // 서버로부터 받은 리뷰 데이터를 사용합니다.
      renderItem={({ item }) => (
        <ReviewItem item={item} onDelete={deleteReview} />
      )} // 리뷰 삭제도
      keyExtractor={(item) => item._id.toString()} // MongoDB의 _id를 사용합니다.
      ListEmptyComponent={
        <Text style={styles.emptyListStyle}>
          내가 친구에게 쓴 리뷰가 하나도 없습니다.
        </Text>
      }
    />
  );
};
const styles = StyleSheet.create({
  // ...
  emptyListStyle: {
    textAlign: "center", // 텍스트를 가운데 정렬합니다.
    marginTop: 20, // 위쪽 여백을 추가합니다.
    fontSize: 16, // 텍스트 크기를 지정합니다.
  },
});

export default ViewWrittenMyReview;
