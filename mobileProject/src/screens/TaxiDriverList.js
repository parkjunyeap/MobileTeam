// 택시 기사님들 나오게 하면 어떨까 하는 화면 .

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Driver from "../components/Driver";
// 일단 쓸필요가없지
// import User from "../components/User";
import { Image } from "react-native";
import { UserType } from "../UserContext";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const TaxiDriverList = () => {
  const [showTrue, setShowTrue] = useState(false); // 기본값 false

  const navigation = useNavigation();
  const moneyImage = require("../../assets/money.png");
  const { userId, setUserId } = useContext(UserType); // 현재 로그인한 유저아이디 갖고와서 그 유저 아이디에
  // // 결제내역에 있는 유저 아이디만 화면에 뿌려줄 수 있게도 ..

  console.log("유저아이디 잘갖고왔는지 드라이버스크린에서;;:", userId);
  // 유저아이디
  const [drivers, setDrivers] = useState([]);
  // 택시기사 배열 로갖고올거
  const [payDrivers, setPaydrivers] = useState([]);

  // 결제한 택시기사

  const fetchPayDrivers = async () => {
    // 이게 결제한 택시기사 //
    try {
      const response = await axios.get(
        `http://10.20.60.52:8000/driverList/payment/${userId}`
      );
      setPaydrivers(response.data); // 새로운 데이터로 상태 업데이트
      console.log("결제한 택시기사 ", response.data);
    } catch (error) {
      console.log("error retrieving new drivers", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {"   "} 기사님 목록
        </Text>
      ),

      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ alignItems: "center" }}>
            <Ionicons
              name="ios-people-circle"
              size={32}
              color="black"
              onPress={() => {
                setShowTrue(false);
              }}
            />
            <Text style={{ color: "black" }}>전체</Text>
          </View>

          <View style={{ alignItems: "center", marginRight: 20 }}>
            <Entypo
              name="credit"
              size={32}
              color="black"
              onPress={() => {
                setShowTrue(true);
              }}
            />
            <Text style={{ color: "black" }}>결제했던</Text>
          </View>
        </View>
      ),
    });
  });

  useEffect(() => {
    fetchPayDrivers();
  }, []);

  // 처음에 그냥 바로
  useEffect(() => {
    const fetchDrivers = async () => {
      axios
        .get("http://10.20.60.52:8000/driverList/") // 드라이버 아이디 전부 넘김.
        .then((response) => {
          console.log("Response data:", response.data); // 전부 찍힘.
          setDrivers(response.data); // 드라이버를 배열에 다 넣는게 끝
        })
        .catch((error) => {
          console.log("error retrieving drivers", error);
        });
    };

    fetchDrivers();
  }, []); // 처음 렌더링 될때 한번만 실행되고 , ㄴㄴ setDriver 이 달라질때마다??

  console.log("drivers", drivers);

  return (
    <View>
      <ScrollView>
        <View style={{ padding: 15 }}>
          {/* {drivers.map((item, index) => (
            <Driver key={index} item={item} />
          ))} */}

          {(showTrue ? payDrivers : drivers).map((item, index) => (
            <Driver key={index} item={item} />
          ))}

          {/* 드라이버 배열에서 . map 에 key , item 해서  그 키에 맞는 아이템들 */}
          {/* Driver({item}) = {해서 여기서 item.name, email} 등 쓸 수 있따! */}
        </View>
      </ScrollView>
    </View>
  );
};
1;
export default TaxiDriverList;

const styles = StyleSheet.create({});
