import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import Clipboard from "@react-native-community/clipboard";
import formatDate from "../../hook/formatDate";
import axios from "axios";
const BookingItem = ({ item }) => {
  const {
    _id, // 이렇게 받는게 맞나?

    bookingDate,
    bookingTime,
    boarderName,
    driverName,
    startPoint,
    endPoint,
  } = item;

  console.log("부킹아이디잘갖고옴", item._id);

  const handleDelete = () => {
    onDelete(item._id); // 예약 아이디를 사용하여 삭제 함수 호출
  };

  const onDelete = async (bookingId) => {
    try {
      const response = await axios.delete(
        `http://10.20.34.195:8000/booking/del/${bookingId}`,
        {
          // 필요한 경우 헤더를 추가합니다. 예: 인증 토큰
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': 'Bearer YOUR_AUTH_TOKEN' // 인증 토큰이 필요한 경우
          },
        }
      );

      alert("성공적으로 예약을 취소하였습니다."); // 성공 메시지 표시
      // 여기에 성공시 수행할 추가적인 로직을 추가할 수 있습니다. 예: 상태 업데이트, 화면 새로고침 등
    } catch (error) {
      console.error("Error during deletion:", error);
      alert("Error deleting booking"); // 오류 메시지 표시
    }
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
