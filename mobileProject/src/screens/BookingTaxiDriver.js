// 예약 하기 전송하면 택시드라이버 에도 예약 메시지 받음.

// 예약 화면 인풋칸 늘어나게 못하겠음.

import React, { useState } from "react";
import { View, Button, StyleSheet, Text, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";

import { useNavigation, useRoute } from "@react-navigation/native"; // useRoute를 통해 데이터를받아올 수 있다.

import { UserType } from "../UserContext"; // 로그인
import { useContext } from "react";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { MAP_KEY } from "../../env";

const BookingTaxiDriver = () => {
  // 날짜 및 시간 상태
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    if (mode === "date") {
      setFormattedDate(currentDate.toLocaleDateString());
    } else {
      setFormattedTime(currentDate.toLocaleTimeString());
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  // 날짜

  const { userId } = useContext(UserType); // 로그인한사람 아이디

  const navigation = useNavigation(); // 이게있어야 화면 옮길 수 있음.

  const route = useRoute();
  const selectedDriverId = route.params.selectedDriverId; // 기사 ID
  const selectedDriverName = route.params.selectedDriverName; // 기사 이름

  console.log("선택한 아이디가 드라이버냐 ", selectedDriverId);

  // 전송버튼 눌렀을 때는 post 로 여기있는 거 전부 날리면 됨. 데이터를
  // const [bookingDate, setBookingDate] = useState(formattedDate); // 로그인 한 userId
  // const [bookingTime, setBookingTime] = useState(formattedTime); // 선택된 , 받는사람 id // 아무것도 없었다가 생기면
  const [boarderId, setBoarderId] = useState(userId);
  const [driverId, setDriverId] = useState(selectedDriverId); // 선택한 기사 아이디
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");

  // handle submit 하면되는데
  //지금 은 모델바껴서 안돌아감
  const handleSubmit = () => {
    const bookingData = {
      bookingDate: formattedDate,
      bookingTime: formattedTime,
      boarderId: boarderId,
      driverId: driverId,
      startPoint: startLocation,
      endPoint: endLocation,
    };

    console.log("현재 들어온 예약데이터 ", bookingData);

    axios
      .post("http://192.168.219.104:8000/bookings", bookingData)
      .then((response) => {
        console.log(response);
        Alert.alert("예약 성공!!", "성공적으로 예약되었습니다");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleStartLocationChange = (value) => {
    console.log("설정될 출발지:", value);
    setStartLocation(value);
  };

  const handleEndLocationChange = (value) => {
    console.log("설정될 목적지:", value);
    setEndLocation(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text> {selectedDriverName}님 택시를 예약하시겠습니까? </Text>

        <View>
          <Button onPress={() => showMode("date")} title="날짜 선택" />
          {formattedDate ? <Text>선택된 날짜: {formattedDate}</Text> : null}
        </View>
        <View>
          <Button onPress={() => showMode("time")} title="시간 선택" />
          {formattedTime ? <Text>선택된 시간: {formattedTime}</Text> : null}
        </View>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}

        {/* Google Places Autocomplete */}
        <Text style={{ fontSize: 20, marginBottom: 5 }}> 예약할 출발지 </Text>

        <View style={styles.location}>
          <GooglePlacesAutocomplete
            styles={autocompleteStyles}
            placeholder="예약할 출발지를 적어주세요!"
            onPress={(data) => handleStartLocationChange(data.description)}
            onFail={(e) => {
              console.log("GooglePlacesAutocomplete onFail : ", e);
            }}
            query={{ key: MAP_KEY, language: "ko", components: "country:kr" }}
            debounce={400}
          />
        </View>

        <Text style={{ fontSize: 20, marginBottom: 5 }}> 예약할 목적지 </Text>

        <View>
          <GooglePlacesAutocomplete
            styles={autocompleteStyles}
            placeholder="예약할 목적지를 적어주세요!"
            onPress={(data) => handleEndLocationChange(data.description)}
            onFail={(e) => {
              console.log("GooglePlacesAutocomplete onFail : ", e);
            }}
            query={{ key: MAP_KEY, language: "ko", components: "country:kr" }}
            debounce={400}
          />
        </View>

        {/* 여기 현재 리뷰보내기 를 눌러서 들어온 사람의 이름이 떴으면 좋겠다. */}
        <Button title="예약" onPress={() => handleSubmit()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d4edda", // 배경색
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%", // 너비
    alignItems: "center", // 내부 요소 정렬
    shadowColor: "#000", // 그림자 색
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rating: {
    paddingVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 5,
    width: "100%",
    minHeight: 100, // 최소 높이
    padding: 10,
    marginTop: 10, // 상단 여백
    textAlignVertical: "top", // 텍스트 상단 정렬
  },
});

const autocompleteStyles = StyleSheet.create({
  container: {
    flex: 0,
    width: "80%", // 컨테이너의 너비를 줄입니다.
    alignSelf: "center", // 컨테이너를 중앙에 위치시킵니다.
  },
  textInput: {
    paddingLeft: 20,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd", // 테두리 색상
    borderRadius: 5, // 모서리 둥글기
    width: "100%", // 입력 필드의 너비를 100%로 설정
  },
  // 결과 목록에 대한 추가적인 스타일을 여기에 정의할 수 있습니다.
});

export default BookingTaxiDriver;
