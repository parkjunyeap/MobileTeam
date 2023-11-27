import React, { useState } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// 즐겨타는 출발지 , 목적지 자동완성
import { MAP_KEY } from "../../env";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import TimePicker from "../components/TImePicker";

import { useNavigation } from "@react-navigation/native";

const FriendsFindDetail = () => {
  const [selectedProvince, setSelectedProvince] = useState("충청남도");
  const [selectedCity, setSelectedCity] = useState("아산시");
  const [favoriteStartLocation, setFavoriteStartLocation] = useState("");
  const [favoriteEndLocation, setFavoriteEndLocation] = useState("");

  const [favoriteTime1, setFavoriteTime1] = useState({
    hour: "01",
    minute: "00",
  });
  const [favoriteTime2, setFavoriteTime2] = useState({
    hour: "01",
    minute: "00",
  });

  // useState 로 관리하는거 즐겨타는 출발지 , 목적지 , 시간 도 해야되는데,,

  const provinces = [
    "강원도",
    "경기도",
    "경상남도",
    "경상북도",
    "광주광역시",
    "대구광역시",
    "대전광역시",
    "부산광역시",
    "서울특별시",
    "세종특별자치시",
    "울산광역시",
    "인천광역시",
    "전라남도",
    "전라북도",
    "제주특별자치도",
    "충청남도",
    "충청북도",
  ]; // 한국의 도 목록

  const cities = [
    "아산시",
    "천안시",
    "공주시",
    // ... 다른 시 목록이 있다면 추가
  ];

  const handleStartLocationChange = (value) => {
    setFavoriteStartLocation(value);
  };

  const handleEndLocationChange = (value) => {
    setFavoriteEndLocation(value);
  };

  const handleTime1Change = (value) => {
    setFavoriteTime1(value);
  };

  const handleTime2Change = (value) => {
    setFavoriteTime2(value);
  };

  const handleReviewButtonClick = () => {
    // 리뷰 보기 버튼 클릭 시 실행할 코드 작성
  };

  const navigation = useNavigation(); // 네비게이션 객체 가져오기

  const handleSaveButtonClick = () => {
    console.log("선택한 도:", selectedProvince);
    console.log("선택한 시:", selectedCity);
    console.log("즐겨타는 출발지:", favoriteStartLocation);
    console.log("즐겨타는 목적지:", favoriteEndLocation);
    console.log(
      "즐겨타는 시간대 1:",
      favoriteTime1.hour + ":" + favoriteTime1.minute
    );
    console.log(
      "즐겨타는 시간대 2:",
      favoriteTime2.hour + ":" + favoriteTime2.minute
    );

    // 이 정보들을 서버로 전송하거나 다른 작업을 수행할 수 있습니다.
    navigation.goBack();
  };

  return (
    <View>
      <Text> 택시를 이용하는 지역</Text>
      {/* Province Picker */}
      <Text>도 : {selectedProvince}</Text>
      <Picker
        selectedValue={selectedProvince}
        onValueChange={(itemValue) => setSelectedProvince(itemValue)}
        style={{ height: 50, width: 250 }}
      >
        {provinces.map((province) => (
          <Picker.Item key={province} label={province} value={province} />
        ))}
      </Picker>
      {/* City Picker */}
      <Text>시 : {selectedCity}</Text>
      <Picker
        selectedValue={selectedCity}
        onValueChange={(itemValue) => setSelectedCity(itemValue)}
        style={styles.picker}
      >
        {cities.map((city) => (
          <Picker.Item key={city} label={city} value={city} />
        ))}
      </Picker>

      <Text> 즐겨타는 출발지 : </Text>
      <View style={styles.location}>
        <GooglePlacesAutocomplete
          placeholder="자주타는 출발지를 적어주세요!"
          styles={{
            container: { flex: 0 },
            textInput: { paddingLeft: 20, height: 50 },
          }}
          onPress={(data) => handleStartLocationChange(data.description)}
          onFail={(e) => {
            console.log("GooglePlacesAutocomplete onFail : ", e);
          }}
          query={{ key: MAP_KEY, language: "ko", components: "country:kr" }}
          debounce={400}
        />
        <View style={styles.locationIcon}>
          <MaterialCommunityIcons name="map-marker" size={20} />
        </View>
      </View>

      <Text> 즐겨타는 목적지 : </Text>
      <View style={styles.location}>
        <GooglePlacesAutocomplete
          placeholder="자주타는 목적지를 적어주세요!"
          styles={{
            container: { flex: 0 },
            textInput: { paddingLeft: 20, height: 40 },
          }}
          onPress={(data) => handleEndLocationChange(data.description)}
          onFail={(e) => {
            console.log("GooglePlacesAutocomplete onFail : ", e);
          }}
          query={{ key: MAP_KEY, language: "ko", components: "country:kr" }}
          debounce={400}
        />
        <View style={styles.locationIcon}>
          <MaterialCommunityIcons name="map-marker" size={20} />
        </View>
      </View>

      <Text> 즐겨타는 시간대 1</Text>
      <TimePicker
        selectedHour={favoriteTime1.hour}
        selectedMinute={favoriteTime1.minute}
        onHourChange={(hour) => setFavoriteTime1((prev) => ({ ...prev, hour }))}
        onMinuteChange={(minute) =>
          setFavoriteTime1((prev) => ({ ...prev, minute }))
        }
      />

      <Text> 즐겨타는 시간대 2</Text>
      <TimePicker
        selectedHour={favoriteTime2.hour}
        selectedMinute={favoriteTime2.minute}
        onHourChange={(hour) => setFavoriteTime2((prev) => ({ ...prev, hour }))}
        onMinuteChange={(minute) =>
          setFavoriteTime2((prev) => ({ ...prev, minute }))
        }
      />

      {/* 버튼 style 먹이느라 */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="초기화"
            onPress={handleReviewButtonClick}
            color="#28a745"
          />
        </View>
        <View style={{ width: 20 }} />
        <View style={styles.buttonWrapper}>
          <Button
            title="검색"
            onPress={handleSaveButtonClick}
            color="#28a745"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    height: 50,
    width: 250,
    marginBottom: 20, // Picker들 사이의 간격을 조정
  },

  location: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    // borderBottomColor : GRAY.LIGHT,
  },
  locationIcon: {
    position: "absolute",
    left: 20,
    top: 16,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  buttonWrapper: {
    flex: 1, // each button will take half of the container width
    borderRadius: 5, // slight roundness to the corners
    overflow: "hidden", // ensures the borderRadius is respected
  },
});

export default FriendsFindDetail;
