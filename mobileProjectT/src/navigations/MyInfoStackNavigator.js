import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MyInfo from "../screens/MyInfo";


import DriverInfo from "../screens/DriverInfo";
import PayMentScreen from "../screens/PayMentScreen";
// 이거는 리뷰 등록하는 스크린인데 테스트 때문에 일단 씀.
const Stack = createStackNavigator();

function MyInfoStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="MyInfo">
      <Stack.Screen
        name="MyInfo"
        component={MyInfo}
        options={{ title: "내 정보" }}
      />

      <Stack.Screen
        name="PayMentScreen"
        component={PayMentScreen}
        options={{ title: "결제내역 (임시)" }}
      />

      <Stack.Screen
        name="DriverInfo"
        component={DriverInfo}
        options={{ title: "기사 정보" }}
      />
    </Stack.Navigator>
  );
}

export default MyInfoStackNavigator;