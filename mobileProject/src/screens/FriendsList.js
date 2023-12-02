// 현재 안쓰거나 , 택시 기사님들 나오게 하면 어떨까 하는 화면 .

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

// 데모를 위한 가짜 데이터 이거는 서버에서 친구 목록 불러와서 보여주는 로직을 짜야겠지..
const friendsData = [
  {
    id: "1",
    name: "박준엽",
    profilePic: require("../../assets/profile2.jpg"), // 이것도 서버에서 주는 이미지로 바꿔야되지.
  },
  {
    id: "2",
    name: "오해성",
    profilePic: require("../../assets/profile2.jpg"),
  },
  // ... 추가 친구 데이터
];

const FriendsList = ({ navigation }) => {
  // navigation prop을 추가해줘야 합니다.

  // // 여기 로직 짜야함. 서버에 친구 id 랑 친구 이름 넘겨줘야할듯.

  // const goToChat = (friendId, friendName) => {
  //   // 채팅 화면으로 이동하는 로직
  //   navigation.navigate("ChatScreen", { friendId, friendName });
  // };

  const goToDetails = (friendId, friendName) => {
    // 상세 정보 화면으로 이동하는 로직
    navigation.navigate("FriendsListDetail");

    // , {
    //   friendId: friendId,
    //   friendName: friendName,
    // }
  };

  // detailScreen 은 안만들엇는데, 상세정보로 가야함. 그 친구의 상세정보. 그러려면id랑 이름만 주면되겟지 props로 넘겨주고

  const renderFriend = ({ item }) => (
    <View style={styles.friendItem}>
      <TouchableOpacity
        onPress={() => {
          goToDetails(item.id, item.name);
        }}
      >
        {/* 이 touchableopacity 누르면 해당 id,name 가지고 dtailScreen 으로 가겠찌. */}
        <Image source={item.profilePic} style={styles.profilePic} />
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={friendsData}
        keyExtractor={(item) => item.id}
        renderItem={renderFriend}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40, // 필요에 따라 마진 조정
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20, // 필요에 따라 마진 조정
    alignSelf: "flex-start",
    marginLeft: 10, // 정렬을 위해 조정
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
  },
  // ... 추가로 원하는 스타일이 있다면 여기에 추가
});

export default FriendsList;
