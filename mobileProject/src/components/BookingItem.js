import { View, StyleSheet, Text } from "react-native";
import formatDate from "../../hook/formatDate";

const BookingItem = ({ item }) => {
  const {
    bookingDate,
    bookingTime,
    boarderName,
    driverName,
    startPoint,
    endPoint,
  } = item;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.name}> 예약 날짜: {bookingDate}</Text>
        <Text style={styles.name}> 예약 시간 : {bookingTime}</Text>
        <Text style={styles.name}> 탑승자명: {boarderName}</Text>
        <Text style={styles.name}> 기사명 : {driverName}</Text>
        <Text style={styles.name}> 출발지 : {startPoint}</Text>
        <Text style={styles.name}> 도착지: {endPoint}</Text>
      </View>

      <View style={styles.dateContainer}>
        {/* <Text style={styles.date}>{formatDate(boardingDate)}</Text> */}
      </View>
    </View>

    // 공유 버튼 만들어서 Text 클립보드에 복사되게? 만들어봐야지.
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

export default BookingItem;
