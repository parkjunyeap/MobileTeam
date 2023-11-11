import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { Rating } from "react-native-ratings";

const Review = () => {
  const [rating, setRating] = useState(3); // 기본 별점
  const [feedback, setFeedback] = useState(""); // 사용자 피드백 텍스트

  // 여기 사람 이름 , ex) 택시기사, 사용자 이름
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
        <TextInput
          style={styles.input}
          onChangeText={setFeedback}
          value={feedback}
          placeholder="시간약속을 잘지켜서 좋았어요"
          multiline
        />

        <Text>OOO님 에게 리뷰를 남겨주세요</Text>
        <Button
          title="전송"
          onPress={() =>
            console.log("Rating: ", rating, "Feedback: ", feedback)
          }
        />
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
