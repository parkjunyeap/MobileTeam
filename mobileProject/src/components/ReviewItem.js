import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import formatDate from "../../hook/formatDate";

import { useContext } from "react";

import { UserType } from "../UserContext";

// 근데 리뷰가 다이어져있어서 ,, 여기에서 아이디도 받아서 받는아이디랑
const ReviewItem = ({ item, onDelete }) => {
  const { userId } = useContext(UserType); // 유저아이디

  // 삭제도받아서
  const { _id, senderName, receiverName, rating, reviewDate, comment } = item;

  // 평점을 나타내는 별표 문자열 생성
  const ratingStars = Array(rating).fill("★").join("");

  const handleDelete = () => {
    onDelete(item._id); // 리뷰 아이디이용 삭제가능
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>보낸 사람: {senderName}</Text>
        <Text style={styles.name}>받는 사람: {receiverName}</Text>
        <Text style={styles.rating}>{ratingStars}</Text>
        <Text style={styles.text}>{comment}</Text>

        {/* 현재 로그인한 사용자와 senderName이 일치할 때만 삭제 버튼 표시 */}
        {userId === senderName && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleDelete}>
            <Text style={styles.cancelButtonText}>삭제</Text>
          </TouchableOpacity>
        )}

        {/* 하려다말음 */}
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.date}>{formatDate(reviewDate)}</Text>
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

  rating: {
    // 예시 스타일
    color: "orange",
  },
});

export default ReviewItem;
