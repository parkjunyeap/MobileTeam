// 내가 택시기사님 에게 쓴 리뷰 확인하는 화면

import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, Text, Image } from "react-native";
import { UserType } from "../UserContext";
import axios from "axios";

import ReviewItem from "../components/ReviewItem";
const ViewWrittenMyReview = () => {
  const { userId } = useContext(UserType);
  const [reviews, setReviews] = useState([]); // 리뷰 데이터 상태

  // 유저아이디 갖고온거를 senderId랑 비교함.
  useEffect(() => {
    // 컴포넌트가 마운트되면 리뷰 데이터를 요청합니다.
    const fetchReviewRequest = async () => {
      try {
        const response = await axios.get(
          `http://10.20.34.124:8000/reviewsT/sender/${userId}` // T가 들어가있음. reviewT에서 가져오는거임이건.
          // ㅇㅋ
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
      renderItem={({ item }) => <ReviewItem item={item} />}
      keyExtractor={(item) => item._id.toString()} // MongoDB의 _id를 사용합니다.
      ListEmptyComponent={
        <Text style={styles.emptyListStyle}>
          내가 택시기사님에게 쓴 리뷰가 하나도없습니다.
        </Text>
      } // 여기에 추가
    />
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
});

export default ViewWrittenMyReview;
