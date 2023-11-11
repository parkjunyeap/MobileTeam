import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MyInfo from "../screens/MyInfo";
import ReviewTaxiMateMyInfo from "../screens/ReviewTaxiMateMyInfo";
import ReviewTaxiMyInfo from "../screens/ReviewTaxiMyInfo";
import MyTaxiMateInfo from "../screens/MyTaxiMateInfo";
// import PaymentDetails from "../screens/PaymentDetails";

import Review from "../screens/Review";
// 이거는 리뷰 등록하는 스크린인데 테스트 때문에 일단 씀.
const Stack = createStackNavigator();

function MyInfoStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="MyInfo">
      <Stack.Screen
        name="MyInfo"
        component={MyInfo}
        options={{ title: "MyInfo" }}
      />
      <Stack.Screen
        name="MyTaxiMateInfo"
        component={MyTaxiMateInfo}
        options={{ title: "MyTaxiMateInfo" }}
      />
      {/* <Stack.Screen
        name="PaymentDetails"
        component={PaymentDetails}
        options={{ title: "PaymentDetails" }}
      /> */}
      <Stack.Screen
        name="Review"
        component={Review}
        options={{ title: "Review" }}
      />
      <Stack.Screen
        name="ReviewTaxiMyInfo"
        component={ReviewTaxiMyInfo}
        options={{ title: "ReviewTaxiMyInfo" }}
      />
      <Stack.Screen
        name="ReviewTaxiMateMyInfo"
        component={ReviewTaxiMateMyInfo}
        options={{ title: "ReviewTaxiMateMyInfo" }}
      />
    </Stack.Navigator>
  );
}

export default MyInfoStackNavigator;
