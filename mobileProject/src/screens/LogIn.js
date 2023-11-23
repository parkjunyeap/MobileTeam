<<<<<<< Updated upstream
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { auth } from "../firebase-config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
=======
import { StyleSheet, Text, View, Button } from "react-native";
// import { auth } from "../firebase-config";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { useState } from "react";
// web 525975453327-5jl51lsjlonujatql95jg1j1782vndk0.apps.googleusercontent.com
// client 525975453327-0a4qs2h2mqkksp7gcojnfdfom1odhrp0.apps.googleusercontent.com
import "react-native-gesture-handler";
import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import { GoogleSignin, GoogleSigninButton } from "react-native-google-signin";
>>>>>>> Stashed changes

const LogIn = ({ onLoginSuccess }) => {
  const [userData, setUserData] = useState(null); // 이 부분을 LogIn 함수 내부로 옮겼습니다.

  function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((data) => {
        setUserData(data.user);
        onLoginSuccess(data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>구글 로그인</Text>

      <TouchableOpacity onPress={handleGoogleLogin} style={styles.button}>
        <Text>로그인</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 16 }}>
        {userData ? `당신의 이름은 : ${userData.displayName}` : '로그인 버튼을 눌러주세요 :)'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff', // 배경색 추가 등의 스타일을 지정할 수 있습니다.
  },
  button: {
    marginTop: 20, // 버튼 스타일도 정의할 수 있습니다.
    backgroundColor: '#blue', // 배경색
    padding: 10, // 패딩
    borderRadius: 5, // 모서리 둥글기
  }
});

export default LogIn;