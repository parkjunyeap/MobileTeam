import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MyInfo from "../screens/MyInfo";
import ReviewTaxiMateMyInfo from "../screens/ReviewTaxiMateMyInfo";
import ReviewTaxiMyInfo from "../screens/ReviewTaxiMyInfo";
import MyTaxiMateInfo from "../screens/MyTaxiMateInfo";
import PaymentDetails from "../screens/PaymentDetails";

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
      <Stack.Screen
        name="PaymentDetails"
        component={PaymentDetails}
        options={{ title: "PaymentDetails" }}
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
