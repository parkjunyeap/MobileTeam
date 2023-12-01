import { View, StyleSheet, Text } from "react-native";

const ReviewItem = ({ item }) => {
  const { senderName, receiverName, rating, reviewDate, comment } = item;

  // 평점을 나타내는 별표 문자열 생성
  const ratingStars = Array(rating).fill("★").join("");

  return (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>보낸 사람: {senderName}</Text>
        <Text style={styles.name}>받는 사람: {receiverName}</Text>
        <Text style={styles.rating}>{ratingStars}</Text>
        <Text style={styles.text}>{comment}</Text>
        <Text style={styles.date}>{reviewDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // 스타일을 여기에 정의합니다.
  itemContainer: {
    // 예시 스타일
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  textContainer: {
    // 예시 스타일
  },
  name: {
    // 예시 스타일
    fontWeight: "bold",
  },
  rating: {
    // 예시 스타일
    color: "orange",
  },
  text: {
    // 예시 스타일
  },
  date: {
    // 예시 스타일
  },
  // 여기에 필요한 나머지 스타일을 추가하세요.
});

export default ReviewItem;
