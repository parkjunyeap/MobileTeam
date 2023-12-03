import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabNavigator from "./BottomTabNavigator"; // 로그인되면 이쪽으로 넘어가게.
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
// import HomeScreen from "./screens/HomeScreen";
// import FriendsScreen from "./screens/FriendsScreen";
// import ChatScreen from "./screens/ChatScreen";
// import ChatMessagesScreen from "./screens/ChatMessagesScreen";
// 이따가 넣을것 이거는 바텀탭 네비게이션에 ? home 을 챗팅네비게이션에 맨처음화면  그리고 챗팅 화면에서 친구추가, 채팅방목록, 채팅메시지보내는 화면
const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen // 그럼 맨처음 이화면이 나오겟지?
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="bottom"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
