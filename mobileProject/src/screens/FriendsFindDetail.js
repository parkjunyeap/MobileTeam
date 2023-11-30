import React, { useState } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MAP_KEY } from "../../env";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TimePicker from "../components/TimePicker";
import { useNavigation } from "@react-navigation/native";

import locationData from "../locationData";

const FriendsFindDetail = () => {
  const [selectedProvince, setSelectedProvince] = useState(
    Object.keys(locationData)[0]
  );
  const [selectedCity, setSelectedCity] = useState(
    locationData[Object.keys(locationData)[0]][0]
  );
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

  const onProvinceChange = (province) => {
    setSelectedProvince(province);
    const citiesForProvince = locationData[province];
    setSelectedCity(citiesForProvince[0]);
  };

  // useState 로 관리하는거 즐겨타는 출발지 , 목적지 , 시간 도 해야되는데,,

  const handleStartLocationChange = (value) => {
    setFavoriteStartLocation(value);
  };

  const handleEndLocationChange = (value) => {
    setFavoriteEndLocation(value);
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
    axios
      .post("http://10.20.32.84:8000/FindTaxiMateDetail", userTaxiInfo)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        // 오류발생시 실행
        console.log("이 오류 : ", error.message);
      });
    // 이 정보들을 서버로 전송하거나 다른 작업을 수행할 수 있습니다.
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text> 택시를 이용하는 지역</Text>
      <Text>도 : {selectedProvince}</Text>
      <Picker
        selectedValue={selectedProvince}
        onValueChange={(itemValue) => onProvinceChange(itemValue)}
        style={styles.picker}
      >
        {Object.keys(locationData).map((province) => (
          <Picker.Item key={province} label={province} value={province} />
        ))}
      </Picker>

      <Text>시 : {selectedCity}</Text>
      <Picker
        selectedValue={selectedCity}
        onValueChange={(itemValue) => setSelectedCity(itemValue)}
        style={styles.picker}
      >
        {locationData[selectedProvince].map((city) => (
          <Picker.Item key={city} label={city} value={city} />
        ))}
      </Picker>

      <Text> 즐겨타는 출발지 : </Text>
      <View style={styles.location}>
        <GooglePlacesAutocomplete
          placeholder="자주타는 출발지를 적어주세요!"
          styles={{
            container: { flex: 0 },
            textInput: { paddingLeft: 20, height: 40 },
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
  container: {
    flex: 1,
    padding: 20,
  },

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
