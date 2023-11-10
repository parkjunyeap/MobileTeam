import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import FriendsFind from "../screens/FriendsFind";
import FriendsFindDetail from "../screens/FriendsFindDetail";

const Stack = createStackNavigator();

function FriendsFindStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="FriendsFind">
      <Stack.Screen
        name="FriendsFind"
        component={FriendsFind}
        options={{ title: "FriendsFind" }}
      />
      <Stack.Screen
        name="FriendsFindDetail"
        component={FriendsFindDetail}
        options={{ title: "FriendsFindDetail" }}
      />
    </Stack.Navigator>
  );
}

export default FriendsFindStackNavigator;
