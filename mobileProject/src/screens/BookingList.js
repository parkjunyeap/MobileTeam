// 예약내역 flat 리스트로 일단 내역 여러개 보여줄 예정

import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useContext } from "react";
import { UserType } from "../UserContext";
import axios from "axios";

import BookingItem from "../components/BookingItem";

const BookingList = () => {
  const { userId, setUserId } = useContext(UserType);
  console.log("결제내역을 위한 아이디", userId);
  const [Booking, setBooking] = useState([]); // 결제내역 데이터 상태

  const deleteBooking = async (bookingId) => {
    try {
      // 사용자에게 예약 취소를 확인
      Alert.alert(
        "예약 취소", // 제목
        "예약을 취소하시겠습니까?", // 메시지
        [
          {
            text: "취소",
            onPress: () => console.log("취소됨"),
            style: "cancel",
          },
          {
            text: "확인",
            onPress: async () => {
              await axios.delete(
                `http://172.30.1.78:8000/Booking/del/${bookingId}`
              );
              setBooking((prevBookings) =>
                prevBookings.filter((b) => b._id !== bookingId)
              );
              alert("성공적으로 예약을 취소하였습니다.");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  useEffect(() => {
    const bookingRequest = async () => {
      try {
        const response = await axios.get(
          `http://172.30.1.78:8000/Booking/boarderId/${userId}`
        );
        if (response.status === 200) {
          setBooking(response.data); //결제내역 을 로그인한유저기준으로 갖고옴
          console.log("대체어디가", response.data);
        }
      } catch (err) {
        console.log("여기서 에러인거지??", err);
      }
    };

    bookingRequest();
  }, []);
  // 요긴 간략하게 결제내역 보여줄 예정이였는데,,, 일단 그 리뷰마냥 나오게 해봄
  return (
    <FlatList
      data={Booking} // 서버로부터 받은 리뷰 데이터를 사용합니다.
      // renderItem={({ item }) => <BookingItem item={item} />}
      renderItem={({ item }) => (
        <BookingItem item={item} onDelete={deleteBooking} />
      )}
      keyExtractor={(item) => item._id.toString()} // MongoDB의 _id를 사용합니다.
    />
  );
};
const styles = StyleSheet.create({});
export default BookingList;
