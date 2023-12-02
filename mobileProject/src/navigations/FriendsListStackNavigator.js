import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import FriendsList from "../screens/FriendsList";
import FriendsListDetail from "../screens/FriendsListDetail";

const Stack = createStackNavigator();

function FriendsListStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="FriendsList">
      <Stack.Screen
        name="FriendsList"
        component={FriendsList}
        options={{
          title: "기사님 목록",
          headerTitleStyle: {
            fontSize: 16, // 폰트 크기 설정
            fontWeight: "bold", // 폰트 두께 설정
          },
        }}
      />
      <Stack.Screen
        name="FriendsListDetail"
        component={FriendsListDetail}
        options={{ title: "친구 상세정보" }}
      />
    </Stack.Navigator>
  );
}

export default FriendsListStackNavigator;
