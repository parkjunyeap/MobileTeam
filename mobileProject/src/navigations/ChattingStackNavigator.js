import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import FriendsScreen from "../screens/FriendsScreen";
import ChatScreen from "../screens/ChatScreen";
import ChatMessagesScreen from "../screens/ChatMessagesScreen";
import FriendsFindDetail from "../screens/FriendsFindDetail";
import ViewReview from "../screens/ViewReview"; // 이름바꿔야함.
import Review from "../screens/Review";

// 채팅 화면에서 친구를 찾을 수있는 화면 추가.

const Stack = createStackNavigator();

function ChattingStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen
        name="Friends"
        component={FriendsScreen}
        options={{ title: "나에게 온 친구 요청" }}
      />

      <Stack.Screen
        name="Chats"
        component={ChatScreen}
        options={{ title: "채팅방" }}
      />

      <Stack.Screen name="Messages" component={ChatMessagesScreen} />

      <Stack.Screen
        name="FriendsFindDetail"
        component={FriendsFindDetail}
        options={{ title: "친구 찾기 검색" }}
      />

      <Stack.Screen name="viewReview" component={ViewReview} />

      {/* 이거그냥 리뷰 작성하기 화면 */}
      <Stack.Screen name="writeReview" component={Review} />
      {/* 이름 바꾸기 귀찮으니까. */}

      {/*  친구 찾기 화면 */}
    </Stack.Navigator>
  );
}

export default ChattingStackNavigator;
