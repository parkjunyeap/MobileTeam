import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MyInfo from "../screens/MyInfo";
import ReviewTaxiMateMyInfo from "../screens/ReviewTaxiMateMyInfo";
import ReviewTaxiMyInfo from "../screens/ReviewTaxiMyInfo";
import MyTaxiMateInfo from "../screens/MyTaxiMateInfo";
import PaymentDetails from "../screens/PaymentDetails";

import Review from "../screens/Review";
// 이거는 리뷰 등록하는 스크린인데 테스트 때문에 일단 씀.
const Stack = createStackNavigator();

function MyInfoStackNavigator({ route }) {
  const { userData } = route.params;

  return (
    <Stack.Navigator initialRouteName="MyInfo">
      <Stack.Screen
        name="MyInfo"
        component={MyInfo}
        initialParams={{ userData: userData }}
        options={{ title: "내 정보" }}
      />
      <Stack.Screen
        name="MyTaxiMateInfo"
        component={MyTaxiMateInfo}
        initialParams={{ userData: userData }}
        options={{ title: "나의 택시친구 정보" }}
      />
      <Stack.Screen
        name="PaymentDetails"
        component={PaymentDetails}
        options={{ title: "결제 내역" }}
      />
      <Stack.Screen
        name="Review"
        component={Review}
        options={{ title: "리뷰작성 (임시)" }}
      />
      <Stack.Screen
        name="ReviewTaxiMyInfo"
        component={ReviewTaxiMyInfo}
        options={{ title: "내가 택시기사에게 보낸 리뷰" }}
      />
      <Stack.Screen
        name="ReviewTaxiMateMyInfo"
        component={ReviewTaxiMateMyInfo}
        options={{ title: "내가 택시친구에게 보낸 리뷰" }}
      />
    </Stack.Navigator>
  );
}

export default MyInfoStackNavigator;
