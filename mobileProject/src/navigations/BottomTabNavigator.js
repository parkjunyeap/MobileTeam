// BottomTabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// 화면 컴포넌트 임포트
import TaxiTouch from "../screens/TaxiTouch";
import ChattingList from "../screens/ChattingList";

import MyInfoStackNavigator from "./MyInfoStackNavigator"; // StackNavigator import
import FriendsFindStackNavigator from "./FriendsFindStackNavigator";
import FriendsListStackNavigator from "./FriendsListStackNavigator";
const BTab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <BTab.Navigator
      initialRouteName="TaxiTouch"
      tabBarOptions={{ activeTintColor: "black", inactiveTintColor: "gray" }}
      screenOptions={{ headerShown: false }}
    >
      {/* MaterialCommunityIcons 중에서 두가지 고르고, 크기와 색깔은 부모 컴포넌트(BTab.Navigator)에 따라서 적용 */}
      <BTab.Screen
        name="친구목록"
        component={FriendsListStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="account-group"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <BTab.Screen
        name="친구찾기"
        component={FriendsFindStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="account-search"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <BTab.Screen
        name="택시잡기"
        component={TaxiTouch}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="car" size={size} color={color} />
          ),
        }}
      />
      <BTab.Screen
        name="채팅"
        component={ChattingList}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="chat" size={size} color={color} />
          ),
        }}
      />
      {/* //스택네비게이터가 둥지틀 장소  */}
      <BTab.Screen
        name="내정보"
        component={MyInfoStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </BTab.Navigator>
  );
};

export default BottomTabNavigator;
