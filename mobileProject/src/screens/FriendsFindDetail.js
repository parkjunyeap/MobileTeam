import React, { useState } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MAP_KEY } from "../../env";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import TimePicker from "../components/TimePicker";
import { useNavigation } from "@react-navigation/native";

import locationData from "../locationData";

import axios from "axios";
import { UserType } from "../UserContext";
import { useContext } from "react";

const FriendsFindDetail = () => {
  const { userId, setUserId } = useContext(UserType); // 여기서 유저 누구로 로그인햇는지 .

  console.log({ userId });

  const [selectedProvince, setSelectedProvince] = useState(
    Object.keys(locationData)[0]
  );
  const [selectedCity, setSelectedCity] = useState(
    locationData[Object.keys(locationData)[0]][0]
  );
  const [favoriteStartLocation, setFavoriteStartLocation] = useState("");
  const [favoriteEndLocation, setFavoriteEndLocation] = useState("");

  const onProvinceChange = (province) => {
    setSelectedProvince(province);
    const citiesForProvince = locationData[province];
    setSelectedCity(citiesForProvince[0]);
  };

  const handleStartLocationChange = (value) => {
    setFavoriteStartLocation(value);
  };

  const handleEndLocationChange = (value) => {
    setFavoriteEndLocation(value);
  };

  const handleReset = () => {
    setSelectedProvince(Object.keys(locationData)[0]);
    setSelectedCity(locationData[Object.keys(locationData)[0]][0]);
    setFavoriteStartLocation("");
    setFavoriteEndLocation("");
  };

  const navigation = useNavigation(); // 네비게이션 객체 가져오기

  const handleSaveButtonClick = () => {
    console.log("선택한 도:", selectedProvince);
    console.log("선택한 시:", selectedCity);
    console.log("즐겨타는 출발지:", favoriteStartLocation);
    console.log("즐겨타는 목적지:", favoriteEndLocation);

    const findTaxiInfo = {
      userId: userId, // 로그인 한 사람 id
      province: selectedProvince, // 도
      city: selectedCity, // 시
      favoriteStartPoint: favoriteStartLocation, // 출발지,
      favoriteEndPoint: favoriteEndLocation,
    };

    // 데이터 다 저장해서 .,.,.

    console.log("서버로 보낼 상세 설정부분 :", findTaxiInfo);
    axios
      .post("http://10.20.64.226:8000/FindTaxiMateDetail", findTaxiInfo)
      .then(function (response) {
        console.log("확인 :", response);
        const users = response.data.user;
        if (users.length === 0) {
          console.log("해당하는 사용자를 찾을 수 없습니다.");
        } else {
          console.log("검색된 유저들 전부 보여주게 배열을.", users); // users 배열 모든 값 해당하는애 출력하기.
          // 사용자 정보 배열을 순회하며 작업 수행
          users.forEach((user) => {
            const userGId = user._id;
            const userName = user.name;
            if (userId !== userGId) {
              console.log("사용자 _id:", userGId);
              console.log("사용자 이름:", userName);
            }

            // 추가 정보 출력 또는 다른 작업 수행
          });
        }

        navigation.navigate("FriendsFindResult", { users: users });
      })
      .catch(function (error) {
        // 오류발생시 실행
        console.log("이 오류 : ", error.message);
      });
    // 이 정보들을 서버로 전송하거나 다른 작업을 수행할 수 있습니다.

    // 이런식으로 users 데이터 넘겨주기 가능.

    // 그냥 화면 하나더 만들어서 찾은 사람 해당하는 아이디만 users.map
    //
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
          <Button title="초기화" onPress={handleReset} color="#28a745" />
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
