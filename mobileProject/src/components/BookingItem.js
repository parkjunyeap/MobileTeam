import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import Clipboard from "@react-native-clipboard/clipboard";
import formatDate from "../../hook/formatDate";
import axios from "axios";
const BookingItem = ({ item, onDelete }) => {
  const {
    _id, // 이렇게 받는게 맞나?

    bookingDate,
    bookingTime,
    boarderName,
    driverName,
    startPoint,
    endPoint,
  } = item;

  console.log("부킹아이디잘갖고옴", item);

  const handleDelete = () => {
    onDelete(item._id); // 예약 아이디를 사용하여 삭제 함수 호출
  };

  const handleShare = () => {
    const bookingInfo = `예약 날짜: ${bookingDate}\n예약 시간: ${bookingTime}\n탑승자명: ${boarderName}\n기사명: ${driverName}\n출발지: ${startPoint}\n도착지: ${endPoint}`;
    Clipboard.setString(bookingInfo);
    alert("예약 정보가 클립보드에 복사되었습니다.");
  };

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
        <TouchableOpacity style={styles.cancelButton} onPress={handleDelete}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>공유</Text>
        </TouchableOpacity>
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

  cancelButton: {
    backgroundColor: "#FF6347", // 토마토색 배경
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  cancelButtonText: {
    color: "#FFFFFF", // 흰색 텍스트
    fontWeight: "bold",
  },
  // 공유 버튼 스타일
  shareButton: {
    backgroundColor: "#1E90FF", // 도저색 배경
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  shareButtonText: {
    color: "#FFFFFF", // 흰색 텍스트
    fontWeight: "bold",
  },
});

export default BookingItem;
