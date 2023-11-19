import React from "react";
import { View, FlatList, StyleSheet, Text, Image } from "react-native";

// Dummy data for the flat list items
const data = [
  {
    id: "1",
    avatar: require("../../assets/profile1.png"), // replace with actual path or URL
    name: "사용자1",
    rating: 4,
    date: "2023-09-15 11:56 AM",
    text: "매우 유익한 리뷰입니다...",
  },
  {
    id: "2",
    avatar: require("../../assets/profile2.jpg"), // replace with actual path or URL
    name: "사용자2",
    rating: 5,
    date: "2023-09-15 03:15 PM",
    text: "정말 도움이 되었습니다...",
  },
  {
    id: "3",
    avatar: require("../../assets/profile2.jpg"), // replace with actual path or URL
    name: "사용자2",
    rating: 5,
    date: "2023-09-15 03:15 PM",
    text: "정말 도움이 되었습니다...",
  },
  {
    id: "4",
    avatar: require("../../assets/profile2.jpg"), // replace with actual path or URL
    name: "사용자2",
    rating: 5,
    date: "2023-09-15 03:15 PM",
    text: "정말 도움이 되었습니다...",
  },
  {
    id: "5",
    avatar: require("../../assets/profile2.jpg"), // replace with actual path or URL
    name: "사용자2",
    rating: 5,
    date: "2023-09-15 03:15 PM",
    text: "정말 도움이 되었습니다...",
  },
  {
    id: "6",
    avatar: require("../../assets/profile2.jpg"), // replace with actual path or URL
    name: "사용자2",
    rating: 5,
    date: "2023-09-15 03:15 PM",
    text: "정말 도움이 되었습니다...",
  },
  {
    id: "7",
    avatar: require("../../assets/profile2.jpg"), // replace with actual path or URL
    name: "사용자2",
    rating: 5,
    date: "2023-09-15 03:15 PM",
    text: "정말 도움이 되었습니다...",
  },
  {
    id: "8",
    avatar: require("../../assets/profile2.jpg"), // replace with actual path or URL
    name: "사용자2",
    rating: 5,
    date: "2023-09-15 03:15 PM",
    text: "정말 도움이 되었습니다...",
  },
  // ... more items
];

// data 이런식으로 받아옴

const ReviewItem = ({ item }) => {
  // item 은
  const { avatar, name, rating, date, text } = item;
  return (
    <View style={styles.itemContainer}>
      <Image source={avatar} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.rating}>{"★".repeat(rating)}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const ReviewTaxiMateMyInfo = ({ navigation }) => {
  return (
    <FlatList
      // data : data는 만들고자 하는 리스트의 soucre를 담는 props.
      data={data} // 데이터를 다 넣고
      // renderItem : 1개의 item을 redner 시키는 props. item이라고 이름짓는것은 약속된 컨벤션이다.
      renderItem={ReviewItem} //renderItem 함수 호출
      // keyExtractor: 지정된 인덱스에서 지정된 항목에 대한 고유 키를 추출하는 데 사용된다.
      // 키는 캐싱에 사용되며 항목 재정렬을 추적하는 반응 키로 사용됨.
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: "space-around",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  rating: {
    fontSize: 14,
    color: "#FFD700",
  },
  text: {
    fontSize: 14,
  },
});

export default ReviewTaxiMateMyInfo;
