// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { BottomTabNavigationApp } from "./navigations/BottomTabNavigationApp";
// const App = () => {
//   return (
//     <NavigationContainer>
//       <View style={styles.container}>
//         <Text>한달남았따</Text>
//         <StatusBar style="auto" />
//         <BottomTabNavigationApp />
//       </View>
//     </NavigationContainer>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

// export default App;

import "react-native-gesture-handler";
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';

//1) 네비게이션 기능이 필요한 컴포넌트를 감싸줄 큰형님 NavigationContainer '수입'
import { NavigationContainer } from "@react-navigation/native";

//2-1) 하부탭네비게이터 기능을 활용할 수 있도록 '수입'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//2-2) 하부탭네비게이터에 '둥지'틀 스택네비게이터 기능을 활용할 수 있도록 '수입'
import { createStackNavigator } from "@react-navigation/stack";

//3) 활용할 아이콘 '수입'
import { MaterialCommunityIcons } from "@expo/vector-icons";

//4) 렌더링할 컴포넌트 '수입'
// import WelcomeScreen from "./app/screens/WelcomeScreen";
// import LoginScreen from "./app/screens/LoginScreen";
// import ProductScreen from "./app/screens/ProductsScreen";
// import ProductDetailsScreen from "./app/screens/ProductDetailsScreen";
import LogIn from "./screens/LogIn";
import Chatting from "./screens/Chatting";
import FriendsFInd from "./screens/FriendsFind";
import FriendsList from "./screens/FriendsList";
import TaxiTouch from "./screens/TaxiTouch";
import MyInfo from "./screens/MyInfo";

import MyReviewInfo from "./screens/MyReviewInfo";
import MyTaxiInfo from "./screens/MyTaxiInfo";

const App = (Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const BTab = createBottomTabNavigator(); // 5) createBottomTabNavigator 메서드 인스턴스화

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUserData(userData);
    console.log(userData)
  };

  const BottomNavigator = ({ userData }) => (
    // 선택한 탭 색깔은 검정, 선택하지 않은 것은 회색
    <BTab.Navigator
      tabBarOptions={{ activeTintColor: "black", inactiveTintColor: "gray" }}
    >
      {/* MaterialCommunityIcons 중에서 두가지 고르고, 크기와 색깔은 부모 컴포넌트(BTab.Navigator)에 따라서 적용 */}
      <BTab.Screen
        name="친구목록"
        component={FriendsList}
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
        component={FriendsFInd}
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
        component={Chatting}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="chat" size={size} color={color} />
          ),
        }}
      />
      {/* //스택네비게이터가 둥지틀 장소  */}
      <BTab.Screen
        name="내정보"
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      >
        {() => <MyInfo userData={userData} />}
      </BTab.Screen>
    </BTab.Navigator>
  );

  const Stack = createStackNavigator();
  // BottomNavigator에 둥지 틀러갈 컴포넌트
  const StackNavigator = () => (
    <Stack.Navigator>
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="나의 리뷰 정보" component={MyReviewInfo} />
      <Stack.Screen name="나의 택시 정보" component={MyTaxiInfo} />
    </Stack.Navigator>
  );

  return (
    //네비게이션 기능이 필요한 컴포넌트를 감싸는 큰형님 NavigationContainer 로 감싸고
    //렌더링할 BottomNavigator 컴포넌트 호출
    <NavigationContainer>
      {!isLoggedIn ? (
        <LogIn onLoginSuccess={handleLoginSuccess} />
      ) : (
        // 로그인 되었을 때 메인 네비게이션을 렌더링합니다.
        <BottomNavigator userData={userData} />
      )}
    </NavigationContainer>
  );
};

export default App;
