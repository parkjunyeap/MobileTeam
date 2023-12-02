import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import TaxiDriverList from "../screens/TaxiDriverList";
import FriendsListDetail from "../screens/FriendsListDetail";

import Review from "../screens/Review";
import ViewFriendReview from "../screens/ViewFriendReview";

const Stack = createStackNavigator();

function DriversListStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="TaxiDriverList">
      <Stack.Screen
        name="TaxiDriverList"
        component={TaxiDriverList}
        options={{
          title: "기사님 목록",
          headerTitleStyle: {
            fontSize: 16, // 폰트 크기 설정
            fontWeight: "bold", // 폰트 두께 설정
          },
        }}
      />
      {/* 이거 상세필요없이 그냥 바로 모달창 띄 워서 하면될듯? */}
      <Stack.Screen
        name="FriendsListDetail"
        component={FriendsListDetail}
        options={{ title: "친구 상세정보" }}
      />

      {/* 리뷰 보내는거는 택시 기사도 똑같으려나? id  */}
      <Stack.Screen
        name="writeReview"
        component={Review}
        options={{ title: "기사님한테 리뷰 보내기" }}
      />

      <Stack.Screen
        name="ViewFriendReview"
        component={ViewFriendReview}
        options={{ title: "기사님이 받은 리뷰 " }}
      />
    </Stack.Navigator>
  );
}

export default DriversListStackNavigator;
