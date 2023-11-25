import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

// Dummy data to represent chat list
const chatListData = [
  { id: "1", name: "마영이", lastMessage: "프로젝트 문의", time: "12:23" },
  {
    id: "2",
    name: "카카오워크조",
    lastMessage: "업무 협의이 필요한 메시지입니다.",
    time: "11:35",
  },
  // 이름, 마지막메시지, 시간만 일단 서버에서 보내주면될듯.
];

const ChatListScreen = ({ navigation }) => {
  // 네비게이션 쓴다는뜻
  const renderItem = (
    { item } // 하나하나 채팅 목록 칸
  ) => (
    <TouchableOpacity // 하나 터치할수있게 터치하면 handlePress 눌렀을때 item.name 을 갖고가서
      style={styles.itemContainer}
      onPress={() => handlePress(item.name)}
    >
      <View style={styles.itemTextContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <FlatList
        data={chatListData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.container}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff", // or any color that matches KakaoTalk's chat list background
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee", // or any color that matches KakaoTalk's list item separator
    alignItems: "center",
  },
  itemTextContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
  },
  lastMessage: {
    color: "grey",
  },
  time: {
    color: "grey",
  },
});

export default ChatListScreen;
