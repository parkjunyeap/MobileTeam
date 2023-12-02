// // 플랫리스트 하나 결제내역

// import { View, StyleSheet, Text } from "react-native";
// import formatDate from "../../hook/formatDate"; // 날짜 제대로
// const PaymentItem = ({ item }) => {
//   const {
//     boarderName,
//     driverName,
//     carNumber,
//     boardingDate,
//     startPoint,
//     endPoint,
//     pay,
//   } = item;

//   //   // 평점을 나타내는 별표 문자열 생성
//   //   const ratingStars = Array(rating).fill("★").join("");

//   return (
//     <View style={styles.itemContainer}>
//       <View style={styles.textContainer}>
//         <Text style={styles.name}>결제자 이름: {boarderName}</Text>
//         <Text style={styles.name}>택시 기사명 : {driverName}</Text>
//         <Text style={styles.name}>택시 차량 번호 : {carNumber}</Text>
//         {/*  차량 번호까지  */}
//         <Text style={styles.date}>{formatDate(boardingDate)}</Text>
//         <Text style={styles.name}>출발지 : {startPoint}</Text>
//         <Text style={styles.name}>도착지 : {endPoint}</Text>
//         <Text style={styles.name}>결제금액: {pay}원 </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   // 스타일을 여기에 정의합니다.
//   itemContainer: {
//     // 예시 스타일
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#cccccc",
//   },
//   textContainer: {
//     // 예시 스타일
//   },
//   name: {
//     // 예시 스타일
//     fontWeight: "bold",
//   },
//   rating: {
//     // 예시 스타일
//     color: "orange",
//   },
//   text: {
//     // 예시 스타일
//   },
//   date: {
//     // 예시 스타일
//   },
//   // 여기에 필요한 나머지 스타일을 추가하세요.
// });

// export default PaymentItem;

import { View, StyleSheet, Text } from "react-native";
import formatDate from "../../hook/formatDate";

const PaymentItem = ({ item }) => {
  const {
    boarderName,
    driverName,
    carNumber,
    boardingDate,
    startPoint,
    endPoint,
    pay,
  } = item;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>결제자 이름: {boarderName}</Text>
        <Text style={styles.name}>택시 기사명 : {driverName}</Text>
        <Text style={styles.name}>택시 차량 번호 : {carNumber}</Text>
        <Text style={styles.name}>출발지 : {startPoint}</Text>
        <Text style={styles.name}>도착지 : {endPoint}</Text>
        <Text style={styles.name}>결제금액: {pay}원</Text>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.date}>{formatDate(boardingDate)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1, // 텍스트 컨테이너가 가능한 많은 공간을 차지하도록 함
  },
  dateContainer: {
    // 날짜를 우측 상단에 위치시키기 위한 스타일
  },
  name: {
    fontWeight: "bold",
  },
  date: {
    // 날짜 텍스트 스타일
    fontWeight: "bold",
  },
  // 기타 필요한 스타일 추가
});

export default PaymentItem;
