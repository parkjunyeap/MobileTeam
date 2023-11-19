import "react-native-gesture-handler";
import React, { useState } from "react";

//1) 네비게이션 기능이 필요한 컴포넌트를 감싸줄 큰형님 NavigationContainer '수입'
import { NavigationContainer } from "@react-navigation/native";

//2-1) 하부탭네비게이터 기능을 활용할 수 있도록 '수입'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//2-2) 하부탭네비게이터에 '둥지'틀 스택네비게이터 기능을 활용할 수 있도록 '수입'
import { createStackNavigator } from "@react-navigation/stack";

import BottomTabNavigator from "./navigations/BottomTabNavigator";

import LogIn from "./screens/LogIn";

const App = (Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const BTab = createBottomTabNavigator(); // 5) createBottomTabNavigator 메서드 인스턴스화

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const Stack = createStackNavigator();
  // BottomNavigator에 둥지 틀러갈 컴포넌트
  const StackNavigator = () => (
    <Stack.Navigator>
      <Stack.Screen name="LogIn" component={LogIn} />
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
        <BottomTabNavigator />
      )}
    </NavigationContainer>
  );
};

export default App;
