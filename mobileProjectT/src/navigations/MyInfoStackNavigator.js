import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MyInfo from "../screens/MyInfo";

import DriverInfo from "../screens/DriverInfo";
import PaymentListDriver from "../screens/PaymentListDriver";
import ViewBookingDriver from "../screens/ViewBookingDriver";
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
        name="PaymentListDriver"
        component={PaymentListDriver}
        options={{ title: "결제내역" }}
      />

      {/* 그냥 결제내역 전부 보여주기 */}

      <Stack.Screen
        name="DriverInfo"
        component={DriverInfo}
        options={{ title: "기사 정보" }}
      />

      {/* 예약 */}
      <Stack.Screen
        name="ViewBookingDriver"
        component={ViewBookingDriver}
        options={{ title: "손님 예약" }}
      />
    </Stack.Navigator>
  );
}

export default MyInfoStackNavigator;
