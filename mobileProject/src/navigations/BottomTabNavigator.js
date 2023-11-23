// BottomTabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// 화면 컴포넌트 임포트
import TaxiTouch from "../screens/TaxiTouch";
import Review from "../screens/Review"; // Review 화면 임포트
import MyInfoStackNavigator from "./MyInfoStackNavigator"; // StackNavigator 임포트

const BTab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <BTab.Navigator
      initialRouteName="택시주행" // 첫 화면을 '택시잡기'로 설정합니다.
      tabBarOptions={{ activeTintColor: "black", inactiveTintColor: "gray" }}
      screenOptions={{ headerShown: false }}
    >
      {/* 리뷰조회 화면 */}
      <BTab.Screen
        name="리뷰조회"
        component={Review}
        options={{
          tabBarLabel: '리뷰',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="star" size={size} color={color} />
          ),
        }}
      />
      {/* 택시잡기 화면 */}
      <BTab.Screen
        name="택시주행"
        component={TaxiTouch}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="car" size={size} color={color} />
          ),
        }}
      />
      {/* 내정보 화면 */}
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
