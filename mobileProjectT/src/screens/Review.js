// 리뷰 작성해서 상대한테 보내기 부분.

import React, { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { Rating } from "react-native-ratings";
import axios from "axios";

import { useNavigation, useRoute } from "@react-navigation/native"; // useRoute를 통해 데이터를받아올 수 있다.

import { UserType } from "../UserContext";
import { useContext } from "react";
// import useFetch from "../../hook/useFetch"; //  useFecth 갖고옴 안씀 저번에 모프 교수님이 참고하라고 알려준거

const Review = () => {
  const { userId, setUserId } = useContext(UserType);

  const navigation = useNavigation(); // 이게있어야 화면 옮길 수 있음.

  const route = useRoute(); // 현재 라우트에 대한 정보를 가져옵니다.
  const selectedUserId = route.params?.selectedUserId; // selectedUserId 값을 추출합니다.
  const selectedUserName = route.params?.selectedUserName; // selectedUserId 값을 추출합니다.

  
  // 전송버튼 눌렀을 때는 post 로 여기있는 거 전부 날리면 됨. 데이터를
  const [senderId, setSenderId] = useState(userId); // 로그인 한 userId
  const [receiverId, setReceiverId] = useState(selectedUserId); // 선택된 , 받는사람 id
  const [rating, setRating] = useState(3); // 기본 별점
  const [comment, setComment] = useState(""); // 사용자가 적은 메시지
  const [reviewDate, setReviewDate] = useState("");
  
  // const [selectedUserName, setSelectedUserNamet] = useState("");
  console.log(userId)
  console.log("선택한 아이디?", selectedUserId);
  console.log("선택한 아이디의 이름?", selectedUserName);
  
  // handle submit 하면되는데
  //지금 은 모델바껴서 안돌아감
  const handleSubmit = () => {
    const reviewData = {
      senderId: senderId,
      receiverId: selectedUserId,
      rating: rating,
      comment: comment,
    };

    console.log(reviewData);
    // 현재 바꾼디비랑 안맞아서 못씀.
    axios
      .post("http://192.168.219.105:8000/write/reviews", reviewData) // 리뷰 데이터 보내는사람, 받는사람, 별점 , 코멘트
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        // 오류발생시 실행
        console.log(error.message);
      })
      .then(() => {});

    Alert.alert("등록 성공!!", "성공적으로 등록되었습니다");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Rating
          type="star"
          ratingCount={5}
          imageSize={40}
          onFinishRating={(value) => setRating(value)}
          style={styles.rating}
        />
        <Text> {selectedUserName}님에게 리뷰를 보냅니다. </Text>

        <TextInput
          style={styles.input}
          onChangeText={setComment} // 보내는내용
          value={comment}
          placeholder="시간약속을 잘지켜서 좋았어요"
          multiline
        />

        {/* 여기 현재 리뷰보내기 를 눌러서 들어온 사람의 이름이 떴으면 좋겠다. */}
        <Button title="전송" onPress={() => handleSubmit()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d4edda", // 배경색
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%", // 너비
    alignItems: "center", // 내부 요소 정렬
    shadowColor: "#000", // 그림자 색
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rating: {
    paddingVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 5,
    width: "100%",
    minHeight: 100, // 최소 높이
    padding: 10,
    marginTop: 10, // 상단 여백
    textAlignVertical: "top", // 텍스트 상단 정렬
  },
});

export default Review;
