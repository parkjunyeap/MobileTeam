import "react-native-gesture-handler";
import React, { useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Import screens here
import LogIn from "./screens/LogIn";
import Chatting from "./screens/Chatting";
import FriendsFind from "./screens/FriendsFind";
import FriendsList from "./screens/FriendsList";
import TaxiTouch from "./screens/TaxiTouch";
import MyInfo from "./screens/MyInfo";
import MyReviewInfo from "./screens/MyReviewInfo";
import MyTaxiInfo from "./screens/MyTaxiInfo";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const BTab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const BottomNavigator = () => (
    <BTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ size, color }) => {
          let iconName;
          if (route.name === "친구목록") {
            iconName = "account-group";
          } else if (route.name === "친구찾기") {
            iconName = "account-search";
          } else if (route.name === "택시잡기") {
            iconName = "car";
          } else if (route.name === "채팅") {
            iconName = "chat";
          } else if (route.name === "내정보") {
            iconName = "account";
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <BTab.Screen
        name="친구목록"
        component={FriendsList}
      />
      <BTab.Screen
        name="친구찾기"
        component={FriendsFind}
      />
      <BTab.Screen
        name="택시잡기"
        component={TaxiTouch}
      />
      <BTab.Screen
        name="채팅"
        component={Chatting}
      />
      <BTab.Screen
        name="내정보"
        component={MyInfo}
      />
    </BTab.Navigator>
  );

  const StackNavigator = () => (
    <Stack.Navigator>
      <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }} />
      <Stack.Screen name="나의 리뷰 정보" component={MyReviewInfo} />
      <Stack.Screen name="나의 택시 정보" component={MyTaxiInfo} />
      {/* StackNavigator에서 하단 탭 내비게이터를 포함시켜야 할 경우 아래 라인을 추가합니다. */}
      {/* <Stack.Screen name="Main" component={BottomNavigator} options={{ headerShown: false }} /> */}
    </Stack.Navigator>
  );

  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <StackNavigator />
      ) : (
        <BottomNavigator />
      )}
    </NavigationContainer>
  );
};

export default App;
