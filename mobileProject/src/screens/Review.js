// 리뷰 작성해서 상대한테 보내기 부분.
// 다른 화면 다 똑같음 리뷰보내는화면은.
// 택시기사한테 보내는 화면은 달라야할지도???????
// 아직 안했음.

import React, { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { Rating } from "react-native-ratings";
import axios from "axios";

import { useNavigation, useRoute } from "@react-navigation/native"; // useRoute를 통해 데이터를받아올 수 있다.

import { UserType } from "../UserContext";
import { useContext } from "react";
// import useFetch from "../../hook/useFetch"; //  useFecth 갖고옴 안씀 저번에 모프 교수님이 참고하라고 알려준거

const Review = () => {
  const { userId } = useContext(UserType);

  const navigation = useNavigation(); // 이게있어야 화면 옮길 수 있음.

  const route = useRoute();
  const selectedUserId = route.params?.selectedUserId; // 사용자 ID
  const selectedUserName = route.params?.selectedUserName; // 사용자 이름
  const selectedDriverId = route.params?.selectedDriverId; // 기사 ID
  const selectedDriverName = route.params?.selectedDriverName; // 기사 이름

  // const [selectedUserName, setSelectedUserNamet] = useState("");
  console.log("선택한 아이디가 유저냐 ", selectedUserId);
  console.log("선택한 아이디가 드라이버냐 ", selectedDriverId);

  // 전송버튼 눌렀을 때는 post 로 여기있는 거 전부 날리면 됨. 데이터를
  const [senderId, setSenderId] = useState(userId); // 로그인 한 userId
  const [receiverId, setReceiverId] = useState(""); // 선택된 , 받는사람 id // 아무것도 없었다가 생기면
  const [rating, setRating] = useState(3); // 기본 별점
  const [comment, setComment] = useState(""); // 사용자가 적은 메시지
  const [reviewDate, setReviewDate] = useState("");

  // handle submit 하면되는데
  //지금 은 모델바껴서 안돌아감
  const handleSubmit = () => {
    const reviewData = {
      senderId: senderId,
      receiverId: selectedDriverId || selectedUserId,
      rating: rating,
      comment: comment,
    };

    console.log("현재 들어온 리뷰데이터 ", reviewData);
    // 현재 바꾼디비랑 안맞아서 못씀.

    // API 엔드포인트 결정
    let apiEndpoint;
    if (selectedDriverId) {
      // 택시 기사에게 보내는 리뷰
      apiEndpoint = "http://10.20.60.52:8000/write/driverReviews";
    } else {
      // 일반 사용자에게 보내는 리뷰
      apiEndpoint = "http://10.20.60.52:8000/write/reviews";
    }

    axios
      .post(apiEndpoint, reviewData)
      .then((response) => {
        console.log(response);
        Alert.alert("등록 성공!!", "성공적으로 등록되었습니다");
      })
      .catch((error) => {
        console.log(error.message);
      });
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
        <Text>
          {" "}
          {selectedDriverName || selectedUserName}님에게 리뷰를 보냅니다.{" "}
        </Text>

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
