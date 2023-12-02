// 검색결과 보여줄 창..
// route 로 검색결과에 해당하는 user 만 갖고와서 뿌려줌
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useContext, useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import axios from "axios";
import User from "../components/User";

import { useRoute, useNavigation } from "@react-navigation/native";

const FirendsFindResult = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { users } = route.params || {}; // users가 없는 경우를 대비해 빈 객체로 초기화

  console.log("route.params:", route.params);

  //   const [users, setUsers] = useState([]);

  // 갖고온 유저들을 보여줘야해서있어야함.

  return (
    <View>
      <ScrollView>
        <View style={{ padding: 15 }}>
          {users ? (
            users.map((item, index) => <User key={index} item={item} />)
          ) : (
            <Text>No users found.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default FirendsFindResult;

const styles = StyleSheet.create({});
