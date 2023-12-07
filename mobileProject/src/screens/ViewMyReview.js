// 나에게 온 리뷰 확인하는 화면
// 잘되구요
import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, Text, Image } from "react-native";
import { UserType } from "../UserContext";
import axios from "axios";

import ReviewItem from "../components/ReviewItem";
const ViewMyReview = () => {
  const { userId, setUserId } = useContext(UserType);
  const [reviews, setReviews] = useState([]); // 리뷰 데이터 상태

  console.log("여기에 로그인한사람 떠야함. 마이택시인포 ", userId);
  // 이렇게하면 로인한유저 갖고올 수 있음.

  useEffect(() => {
    // 컴포넌트가 마운트되면 리뷰 데이터를 요청합니다.
    const fetchReviewRequest = async () => {
      try {
        const response = await axios.get(
          `http://10.20.60.238:8000/reviews/receiver/user/${userId}`
        );
        if (response.status === 200) {
          setReviews(response.data); // 서버로부터 받은 데이터를 상태에 저장합니다.
          console.log(response.data);
        }
      } catch (err) {
        console.error("리뷰 데이터를 가져오는 데 실패했습니다.", err);
        // 여기서 에러가,,
      }
    };

    fetchReviewRequest();
  }, [userId]); // userId가 바뀔 때마다 리뷰를 다시 요청합니다.

  return (
    <FlatList
      data={reviews} // 서버로부터 받은 리뷰 데이터를 사용합니다.
      renderItem={({ item }) => <ReviewItem item={item} />}
      keyExtractor={(item) => item._id.toString()} // MongoDB의 _id를 사용합니다.
    />
  );
};

const styles = StyleSheet.create({});

export default ViewMyReview;
