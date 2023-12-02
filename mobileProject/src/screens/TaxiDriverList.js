// 택시 기사님들 나오게 하면 어떨까 하는 화면 .

import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import axios from "axios";
import Driver from "../components/Driver";
// 일단 쓸필요가없지
// import User from "../components/User";

const HomeScreen = () => {
  const navigation = useNavigation();
  // const { userId, setUserId } = useContext(UserType); // 현재 로그인한 유저아이디 갖고와서 그 유저 아이디에
  // // 결제내역에 있는 유저 아이디만 화면에 뿌려줄 수 있게도 ..

  const [drivers, setDrivers] = useState([]);
  // 택시기사 배열 로갖고올거

  // 처음에 그냥 바로
  useEffect(() => {
    const fetchDrivers = async () => {
      axios
        .get("http://10.20.64.25:8000/driverList/") // 드라이버 아이디 전부 넘김.
        .then((response) => {
          console.log("Response data:", response.data); // 전부 찍힘.
          setDrivers(response.data); // 드라이버를 배열에 다 넣고
        })
        .catch((error) => {
          console.log("error retrieving drivers", error);
        });
    };

    fetchDrivers();
  }, []); // 처음 렌더링 될때 한번만 실행되고 , 이걸로

  console.log("drivers", drivers);

  return (
    <View>
      <ScrollView>
        <View style={{ padding: 15 }}>
          {/* // index = key , item == item.... */}
          {/* {users.map((item, index) => (
            <User key={index} item={item} />
          ))} */}

          {drivers.map((item, index) => (
            <Driver key={index} item={item} />
          ))}
          <Text> 현재 택시기사 보여줄예정</Text>
          {/*  */}
        </View>
      </ScrollView>
    </View>
  );
};
1;
export default HomeScreen;

const styles = StyleSheet.create({
  // button: {
  //   // Match the style with your design
  //   backgroundColor: "#4CAF50", // This is the green background
  //   padding: 15,
  //   borderRadius: 5,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // buttonText: {
  //   color: "#fff",
  //   // Add other styles for your text if needed
  // },
});
