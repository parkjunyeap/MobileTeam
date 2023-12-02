// 사실상 지금 현재 채팅화면 부분

import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import jwt_decode from "jwt-decode"; // 유튜브에선 이렇게 import 하네
// import { jwtDecode } from "jwt-decode"; // 이게 잘 import 하긴하네
// import jwtDecode from "jwt-decode"; // ES6 모듈 문법
// import * as jwtDecode from "jwt-decode"; // 다안되면 이렇게
import axios from "axios";
import User from "../components/User";
const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Swift Chat</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons
            onPress={() => navigation.navigate("Chats")}
            name="chatbox-ellipses-outline"
            size={24}
            color="black"
          />
          <MaterialIcons
            onPress={() => navigation.navigate("Friends")}
            name="people-outline"
            size={24}
            color="black"
          />
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      // console.log("함수가 잘임폴트됐는지", MaterialIcons);
      // console.log("jwtDecode 이거임폴트가안되네", jwt_decode);
      // // 잘되는지
      // console.log(AsyncStorage, "그냥함수자체가 import 잘됐는지?");

      const token = await AsyncStorage.getItem("authToken");
      // console.log("홈에선 토큰이있는데 Token:", token);
      // console.log("decoded 토큰 접근");
      const decodedToken = jwt_decode(token);
      // console.log(
      //   "여기에서 디코드 토큰이 만들어졌어야하는건데 안됐으면 jwt_decode가 안돌아가는거네"
      // );
      console.log("Decoded Token:", decodedToken);
      const userId = decodedToken.userId;
      console.log("UserId:", userId);
      setUserId(userId);

      axios
        .get(`http://172.30.1.78:8000/users/${userId}`)
        .then((response) => {
          console.log("Response data:", response.data);
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });
    };

    fetchUsers();
  }, []);

  console.log("users", users);
  return (
    <View>
      <ScrollView>
        <View style={{ padding: 10 }}>
          {users.map((item, index) => (
            <User key={index} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
1;
export default HomeScreen;

const styles = StyleSheet.create({});
