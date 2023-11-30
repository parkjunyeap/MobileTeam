import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LogIn from './screens/LogIn';
import CertificationScreen from './screens/CertificationScreen';
import BottomTabNavigator from './navigations/BottomTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLicenseRegistered, setIsLicenseRegistered] = useState(false);

  // 사용자 로그인 및 자격증 등록 상태 확인
  useEffect(() => {
    const initializeApp = async () => {
      const userInfo = await AsyncStorage.getItem('@user');
      const licenseInfo = await AsyncStorage.getItem('@license');
      setIsSignedIn(!!userInfo);
      setIsLicenseRegistered(!!licenseInfo);
    };

    initializeApp();
  }, []);

  const handleLoginSuccess = () => {
    setIsSignedIn(true);
  };

  const handleCertificationScreenSuccess = () => {
    setIsLicenseRegistered(true);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isSignedIn ? (
          <Stack.Screen name="LogIn">
            {props => <LogIn {...props} onLoginSuccess={handleLoginSuccess} />}
          </Stack.Screen>
        ) : !isLicenseRegistered ? (
          <Stack.Screen name="CertificationScreen">
            {props => <CertificationScreen {...props} onCertificationScreenSuccess={handleCertificationScreenSuccess} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;