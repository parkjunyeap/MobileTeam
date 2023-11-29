import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MyInfo from "../screens/MyInfo";
import ViewReview from "../screens/ViewReview";
import ReviewTaxiMyInfo from "../screens/ReviewTaxiMyInfo";
import MyTaxiMateInfo from "../screens/MyTaxiMateInfo";
import PaymentList from "../screens/PaymentList";
import PaymentDetail from "../screens/PaymentDetail";

import Review from "../screens/Review";
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
        name="MyTaxiMateInfo"
        component={MyTaxiMateInfo}
        options={{ title: "나의 택시친구 정보" }}
      />
      <Stack.Screen
        name="PaymentList"
        component={PaymentList}
        options={{ title: "결제 내역" }}
      />
      <Stack.Screen
        name="Review"
        component={Review}
        options={{ title: "리뷰작성 (임시)" }}
      />
      {/* ViewReview 로 대체할 예정 모든 나에게 온 리뷰도 , 내가 친구에게 or 택시기사에게  보낸리뷰도, "성연호"라는 친구가 받은 리뷰도 , */}
      <Stack.Screen
        name="ReviewTaxiMyInfo"
        component={ReviewTaxiMyInfo}
        options={{ title: "내가 택시기사에게 보낸 리뷰" }}
      />
      <Stack.Screen
        name="ViewReview"
        component={ViewReview}
        options={{ title: "내가 택시친구에게 보낸 리뷰" }}
      />

      <Stack.Screen
        name="PaymentDetail"
        component={PaymentDetail}
        options={{ title: "결제상세내역" }}
      />
    </Stack.Navigator>
  );
}

export default MyInfoStackNavigator;
