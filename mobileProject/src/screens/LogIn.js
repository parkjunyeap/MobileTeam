import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogIn = ({ onLoginSuccess }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "525975453327-0a4qs2h2mqkksp7gcojnfdfom1odhrp0.apps.googleusercontent.com",
    webClientId: "525975453327-5jl51lsjlonujatql95jg1j1782vndk0.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleSignInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  const handleSignInWithGoogle = async (token) => {
    try {
      const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await userInfoResponse.json();
      setUserInfo(userInfo);
      await AsyncStorage.setItem('@user', JSON.stringify(userInfo));
      onLoginSuccess();
    } catch (error) {
      console.error("Google 로그인 실패: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google 로그인</Text>
      <Button title="Sign in with Google" onPress={() => promptAsync()} />
      {userInfo && <Text>환영합니다, {userInfo.name}!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default LogIn;
