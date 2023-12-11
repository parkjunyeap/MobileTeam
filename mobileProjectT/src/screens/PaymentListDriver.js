// 결제내역 flat 리스트로 일단 내역 여러개 보여줄 예정

// ex) 유저나 채팅처럼 . 여러개

// 먼저 user 가 누구인지 여기서도 알아야함 .
// get 으로 유저에 결제내역 갖고와서 // 기사이름, 출발지 ,도착지 , 날짜 만 띄워지게
//

import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import { useContext } from "react";
import { UserType } from "../UserContext";
import axios from "axios";

import PaymentItem from "../components/PaymentItem";

const PaymentListDriver = () => {
  const { userId, setUserId } = useContext(UserType);

  // 택시유저 아이디
  console.log("결제내역을 위한 아이디", userId);
  const [payments, setPayments] = useState([]); // 결제내역 데이터 상태

  useEffect(() => {
    const paymentRequest = async () => {
      try {
        const response = await axios.get(
          `http://10.20.60.231:8000/payments/driverId/${userId}`
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

  return (
    <FlatList
      data={payments} // 서버로부터 받은 리뷰 데이터를 사용합니다.
      renderItem={({ item }) => <PaymentItem item={item} />}
      keyExtractor={(item) => item._id.toString()} // MongoDB의 _id를 사용합니다.
    />
  );
};
const styles = StyleSheet.create({});

export default PaymentListDriver;
