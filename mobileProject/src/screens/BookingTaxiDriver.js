import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";

import { useNavigation, useRoute } from "@react-navigation/native";
import { UserType } from "../UserContext";
import { useContext } from "react";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { MAP_KEY } from "../../env";

const BookingTaxiDriver = () => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");

  const onChange = (event, selectedDate) => {
    // 시간 정하기
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

  const { userId } = useContext(UserType);
  const navigation = useNavigation();
  const route = useRoute();
  const selectedDriverId = route.params.selectedDriverId; // 라우트 파라미터에서 선택된 드라이버의 ID를 가져옴
  const selectedDriverName = route.params.selectedDriverName; // 라우트 파라미터에서 선택된 드라이버의 이름을 가져옴

  const [boarderId, setBoarderId] = useState(userId);
  const [driverId, setDriverId] = useState(selectedDriverId);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");

  const handleSubmit = () => {
    const bookingData = {
      bookingDate: formattedDate,
      bookingTime: formattedTime,
      boarderId: boarderId,
      driverId: driverId,
      startPoint: startLocation,
      endPoint: endLocation,
    };

    axios
      .post("http://10.20.34.180:8000/bookings", bookingData)
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

        <View style={styles.dateTimeContainer}>
          <TouchableOpacity
            onPress={() => showMode("date")}
            style={styles.dateTimeButton}
          >
            <Text>날짜 선택</Text>
          </TouchableOpacity>
          {formattedDate ? <Text>선택된 날짜: {formattedDate}</Text> : null}
        </View>
        <View style={styles.dateTimeContainer}>
          <TouchableOpacity
            onPress={() => showMode("time")}
            style={styles.dateTimeButton}
          >
            <Text>시간 선택</Text>
          </TouchableOpacity>
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

        <View style={styles.location}>
          <Text style={styles.inputLabel}>예약할 출발지</Text>
          <GooglePlacesAutocomplete
            styles={{
              container: { flex: 0 },
              textInput: { paddingLeft: 20, height: 40 },
            }}
            placeholder="출발지를 입력하세요"
            onPress={(data) => handleStartLocationChange(data.description)}
            query={{ key: MAP_KEY, language: "ko", components: "country:kr" }}
            debounce={400}
          />
          <Text style={styles.inputLabel}>예약할 목적지</Text>
          <GooglePlacesAutocomplete
            styles={{
              container: { flex: 0 },
              textInput: { paddingLeft: 20, height: 40 },
            }}
            placeholder="목적지를 입력하세요"
            onPress={(data) => handleEndLocationChange(data.description)}
            query={{ key: MAP_KEY, language: "ko", components: "country:kr" }}
            debounce={400} // 0.4 초 후에 입력한 지도를 완성해서 보여줌
          />
        </View>

        <TouchableOpacity onPress={() => handleSubmit()} style={styles.button}>
          <Text style={styles.buttonText}>예약</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateTimeButton: {
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  inputLabel: {
    fontSize: 16,
  },
  location: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookingTaxiDriver;
