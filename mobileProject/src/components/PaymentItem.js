// 플랫리스트 하나 결제내역

import { View, StyleSheet, Text } from "react-native";
import formatDate from "../../hook/formatDate"; // 날짜 제대로
const PaymentItem = ({ item }) => {
  const { boarderName, driverName, boardingDate, startPoint, endPoint, pay } =
    item;

  //   // 평점을 나타내는 별표 문자열 생성
  //   const ratingStars = Array(rating).fill("★").join("");

  return (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>결제자 이름: {boarderName}</Text>
        <Text style={styles.name}>택시 기사명 : {driverName}</Text>

        <Text style={styles.date}>{formatDate(boardingDate)}</Text>
        <Text style={styles.name}>출발지 : {startPoint}</Text>
        <Text style={styles.name}>도착지 : {endPoint}</Text>
        <Text style={styles.name}>결제금액: {pay}원 </Text>
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

export default PaymentItem;
