// 바텀탭
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// 화면 컴포넌트 임포트
import TaxiTouch from "../screens/TaxiTouch";

import MyInfoStackNavigator from "./MyInfoStackNavigator"; // StackNavigator import

import DriversListStackNavigator from "./DriversListStackNavigator";
import ChattingStackNavigator from "./ChattingStackNavigator";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const BTab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <BTab.Navigator
      initialRouteName="TaxiTouch"
      // tabBarOptions={{ activeTintColor: "black", inactiveTintColor: "gray" }}

      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      }}
    >
      {/* MaterialCommunityIcons 중에서 두가지 고르고, 크기와 색깔은 부모 컴포넌트(BTab.Navigator)에 따라서 적용 */}
      <BTab.Screen
        name="기사님"
        component={DriversListStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="drivers-license-o" size={24} color="black" />
          ),
        }}
      />

      <BTab.Screen
        name="택시잡기"
        component={TaxiTouch}
        options={{
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="taxi" size={24} color="black" />
          ),
        }}
      />
      <BTab.Screen
        name="친구"
        component={ChattingStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            // <MaterialCommunityIcons name="chat" size={size} color={color} />
            <FontAwesome5 name="user-friends" size={24} color="black" />
          ),
        }}
      />
      {/* //스택네비게이터가 둥지틀 장소  */}
      <BTab.Screen
        name="내정보"
        component={MyInfoStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-circle" size={24} color="black" />
          ),
        }}
      />
    </BTab.Navigator>
  );
};

export default BottomTabNavigator;
