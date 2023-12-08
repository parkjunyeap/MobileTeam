// 결제내역 flat 리스트로 일단 내역 여러개 보여줄 예정

// ex) 유저나 채팅처럼 . 여러개

// 먼저 user 가 누구인지 여기서도 알아야함 .
// get 으로 유저에 결제내역 갖고와서 // 기사이름, 출발지 ,도착지 , 날짜 만 띄워지게
//

import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { UserType } from "../UserContext";
import axios from "axios";

import PaymentItem from "../components/PaymentItem";
// import { set } from "mongoose"; // 이거뭔데?

// const dummyData = {
//   boarderId: "656203a7e05543faf0d7a0b3", // 테스트로 park / park
//   driverId: "6569a600f3abe1ee79d45bb7", // test 위해서 Driver1@naver.com / 1111
//   boardingDate: "2023-09-17T12:00:00.000Z",
//   startPoint: "서울역",
//   endPoint: "강남역",
//   pay: "15000",
// };

// paymentData

const PaymentList = () => {
  const { userId, setUserId } = useContext(UserType);
  console.log("결제내역을 위한 아이디", userId);
  const [payments, setPayments] = useState([]); // 결제내역 데이터 상태

  const navigation = useNavigation();

  useEffect(() => {
    const paymentRequest = async () => {
      try {
        const response = await axios.get(
          `http://10.20.64.91:8000/payments/boarderId/${userId}`
        );
        if (response.status === 200) {
          setPayments(response.data); //결제내역 을 로그인한유저기준으로 갖고옴
        }
      } catch (err) {
        console.log("여기서 에러인거지??", err);
      }
    };

    paymentRequest();
  }, []);

  // 요긴 간략하게 결제내역 보여줄 예정이였는데,,, 일단 그 리뷰마냥 나오게 해봄

  return (
    <FlatList
      data={payments} // 서버로부터 받은 리뷰 데이터를 사용합니다.
      renderItem={({ item }) => <PaymentItem item={item} />}
      keyExtractor={(item) => item._id.toString()} // MongoDB의 _id를 사용합니다.
    />
  );
};

// const styles = StyleSheet.create({
//   itemTouchable: {
//     backgroundColor: "white",
//   },
//   itemContainer: {
//     flexDirection: "column",
//     padding: 10,
//   },
//   articleContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   articleName: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   date: {
//     fontSize: 16,
//   },
//   details: {
//     fontSize: 14,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: "#737373",
//     alignSelf: "stretch",
//   },
// });

const styles = StyleSheet.create({});

export default PaymentList;
