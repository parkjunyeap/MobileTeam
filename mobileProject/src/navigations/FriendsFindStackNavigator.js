// 일단 친구찾기 부분 없앰.

// 이거 안씀!!

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import FriendsFind from "../screens/FriendsFind";
import FriendsFindDetail from "../screens/FriendsFindDetail";

const Stack = createStackNavigator();

function FriendsFindStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="FriendsFind">
      <Stack.Screen
        name="FriendsFind"
        component={FriendsFind}
        options={{ title: "친구찾기" }}
      />
      <Stack.Screen
        name="FriendsFindDetail"
        component={FriendsFindDetail}
        options={{ title: "친구찾기검색" }}
      />
    </Stack.Navigator>
  );
}

export default FriendsFindStackNavigator;
