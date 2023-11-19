import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// import FriendsFind from "../screens/FriendsFind";
// import FriendsFindDetail from "../screens/FriendsFindDetail";
import Chatting from "../screens/Chatting";
import ChattingDetail from "../screens/ChattingDetail";

const Stack = createStackNavigator();

function ChattingStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Chatting">
      <Stack.Screen
        name="Chatting"
        component={Chatting}
        options={{ title: "채팅" }}
      />
      <Stack.Screen
        name="ChattingDetail"
        component={ChattingDetail}
        options={{ title: "상세채팅..." }}
      />
    </Stack.Navigator>
  );
}

export default ChattingStackNavigator;
