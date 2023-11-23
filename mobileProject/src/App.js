// App.js
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./navigations/BottomTabNavigator";
import LogIn from "./screens/LogIn";
import CertificationScreen from './screens/CertificationScreen'; // 적절한 경로로 수정하세요

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const Stack = createStackNavigator();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const StackNavigator = () => (
    <Stack.Navigator>
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="Certification" component={CertificationScreen} />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <LogIn onLoginSuccess={handleLoginSuccess} />
      ) : (
        <BottomTabNavigator />
      )}
    </NavigationContainer>
  );
};

export default App;
