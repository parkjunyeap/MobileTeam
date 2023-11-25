// 채팅화면을 네비게이션으로 관리

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ChattingList from "../screens/ChattingList";
import ChattingDetail from "../screens/ChattingDetail";

const Stack = createStackNavigator();

function ChattingStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="ChattingList">
      <Stack.Screen
        name="ChattingList"
        component={ChattingList}
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
