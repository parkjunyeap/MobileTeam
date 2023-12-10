// 회원가입화면

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const navigation = useNavigation();

  // Firebase 앱 초기화
  const app = initializeApp(firebaseConfig);

  // Firebase Storage 인스턴스 얻기
  const storage = getStorage(app);

  // 이거 그냥 네비게이션 써서 화면이동해준다는 뜻
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const imageName = asset.uri.substring(asset.uri.lastIndexOf("/") + 1);

        const response = await fetch(asset.uri);
        const blob = await response.blob();

        //const storage = getStorage(); // Firebase Storage 인스턴스를 얻어옵니다.
        const storageRef = ref(storage, `rn-photo/${imageName}`); // storageRef 생성
        await uploadBytes(storageRef, blob); // 파일 업로드

        const downloadURL = await getDownloadURL(storageRef); // 업로드한 파일의 다운로드 URL 얻기
        setImage(downloadURL);
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  // navigation.goback() // 이런식으로씀
  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      image: image,
    };
    // 유저 객체에 담음 상태변수들

    // send a POST  request to the backend API to register the user
    axios
      .post("http://192.168.0.14:8000/register", user) // 로컬호스트/8000번으로 레지스터 Url, user 객체를줌
      .then((response) => {
        // 그러면. res 로 잘됏나 안됏나 받음. 그리고 메시지띄움. 그리고 set으로 다른거 다 빈칸으로만듬
        console.log(response);
        Alert.alert("등록 성공!!", "성공적으로 등록되었습니다");
        setName("");
        setEmail("");
        setPassword("");
        setImage("");
      })
      .catch((error) => {
        // 에러 받고 출력
        Alert.alert("등록 오류!!", "등록하는 동안 오류가 발생했습니다");
        console.log("registration failed", error);
      });
  };
  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          padding: 10,
          alignItems: "center",
        }}
      >
        <KeyboardAvoidingView>
          <View
            style={{
              marginTop: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#4A55A2", fontSize: 17, fontWeight: "600" }}>
              회원가입
            </Text>

            <Text style={{ fontSize: 17, fontWeight: "600", marginTop: 15 }}>
              로그인하려면 회원가입을 해주세요.
            </Text>
          </View>

          <View style={{ marginTop: 50 }}>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                이름
              </Text>

              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                style={{
                  fontSize: email ? 18 : 18,
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                  marginVertical: 10,
                  width: 300,
                }}
                placeholderTextColor={"black"}
                placeholder="이름을 입력하세요."
              />
            </View>

            <View>
              <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                이메일
              </Text>

              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={{
                  fontSize: email ? 18 : 18,
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                  marginVertical: 10,
                  width: 300,
                }}
                placeholderTextColor={"black"}
                placeholder="이메일을 입력하세요"
              />
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                비밀번호
              </Text>

              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                style={{
                  fontSize: email ? 18 : 18,
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                  marginVertical: 10,
                  width: 300,
                }}
                placeholderTextColor={"black"}
                placeholder="비밀번호를 입력하세요"
              />
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                프로필 등록
              </Text>
              <View style={styles.imagePickerContainer}>
                <TouchableOpacity onPress={pickImage}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                  ) : (
                    <View style={styles.placeholderContainer}>
                      <Text style={styles.placeholderText}>
                        프로필 사진 등록
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Pressable
              onPress={handleRegister}
              style={{
                width: 200,
                backgroundColor: "#4A55A2",
                padding: 15,
                marginTop: 50,
                marginLeft: "auto",
                marginRight: "auto",
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                회원가입
              </Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.goBack()}
              style={{ marginTop: 15 }}
            >
              <Text
                style={{ textAlign: "center", color: "gray", fontSize: 16 }}
              >
                이미 계정이 있으신가요? 로그인
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  imagePickerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  placeholderContainer: {
    width: 150,
    height: 150,
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  placeholderText: {
    color: "#a1a1a1",
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "cover",
  },
});
