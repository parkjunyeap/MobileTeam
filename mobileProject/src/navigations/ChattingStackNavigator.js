import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import FriendsScreen from "../screens/FriendsScreen";
import ChatScreen from "../screens/ChatScreen";
import ChatMessagesScreen from "../screens/ChatMessagesScreen";
import FriendsFindDetail from "../screens/FriendsFindDetail";
import ViewMyReview from "../screens/ViewMyReview"; // 이름바꿔야함.
import Review from "../screens/Review";
import ViewFriendReview from "../screens/ViewFriendReview";
import FriendsFindResult from "../screens/FirendsFindResult";

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

      <Stack.Screen
        name="FriendsFindResult"
        component={FriendsFindResult}
        options={{ title: "친구 검색 결과" }}
      />

      {/* 스택으로 검색한화면 보여줄예정입니다. */}

      <Stack.Screen
        name="ViewMyReview"
        component={ViewMyReview}
        options={{ title: "내가 받은 리뷰" }}
      />

      <Stack.Screen
        name="ViewFriendReview"
        component={ViewFriendReview}
        options={{ title: "친구가 받은 리뷰 " }}
      />

      {/* 이거그냥 리뷰 작성하기 화면 */}
      <Stack.Screen
        name="writeReview"
        component={Review}
        options={{ title: "리뷰 보내기" }}
      />

      {/* 이름 바꾸기 귀찮으니까. */}

      {/*  친구 찾기 화면 */}
    </Stack.Navigator>
  );
}

export default ChattingStackNavigator;
