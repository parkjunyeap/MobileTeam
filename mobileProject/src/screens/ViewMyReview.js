// 나에게 온 리뷰 확인하는 화면

import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, Text, Image } from "react-native";
import { UserType } from "../UserContext";
import axios from "axios";

import ReviewItem from "../components/ReviewItem";
const ViewMyReview = () => {
  const { userId } = useContext(UserType);
  const [reviews, setReviews] = useState([]); // 리뷰 데이터 상태

  useEffect(() => {
    // 컴포넌트가 마운트되면 리뷰 데이터를 요청합니다.
    const fetchReviewRequest = async () => {
      try {
        const response = await axios.get(
          `http://10.20.64.25:8000/reviews/receiver/${userId}`
        );
        if (response.status === 200) {
          setReviews(response.data); // 서버로부터 받은 데이터를 상태에 저장합니다.
          console.log(response.data);
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
          <Text style={styles.boldText}></Text>당신의 리뷰가 하나도 없습니다.
        </Text>
      } // 여기에 추가
    />
  );
};

const styles = StyleSheet.create({});

export default ViewMyReview;
