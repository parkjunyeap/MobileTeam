import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// 즐겨타는 출발지 , 목적지 자동완성
import { MAP_KEY } from "../../env";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import TimePicker from "../components/TImePicker";
import axios from "axios";
import { useContext } from "react";

import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
const MyTaxiMateInfo = () => {
  // 이렇게하면 로그인한유저 갖고올 수 있음.
  const { userId, setUserId } = useContext(UserType);

  console.log("여기에 로그인한사람 떠야함. 마이택시인포 ", userId);
  // 이렇게 하면 !!!!!!!!!!
  // 지금 로그인한 사용자의 userId 를 받아올 수 있네.
  const navigation = useNavigation();

  const [selectedProvince, setSelectedProvince] = useState("충청남도");
  const [selectedCity, setSelectedCity] = useState("아산시");
  const [favoriteStartLocation, setFavoriteStartLocation] = useState("아산"); // 아산
  const [favoriteEndLocation, setFavoriteEndLocation] = useState("천안"); //천안

  const [favoriteTime1, setFavoriteTime1] = useState({
    hour: "01",
    minute: "00",
  });
  const [favoriteTime2, setFavoriteTime2] = useState({
    hour: "01",
    minute: "00",
  });

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

  const viewTaxiMateInfo = async () => {
    try {
      const response = await fetch(
        `http://10.20.64.77:8000/ViewTaxiMateInfo/${userId}`
      );

      const data = await response.json(); // 택시 친구 정보 json 으로 가져옴 .
      // setRecepientData(data);
      //이런식으로 set 어쩌구 (data) 해주면될것같은데.

      console.log("불러온 data:", data);
      setSelectedProvince(data.infoSetting.province || "충청남도");
      setSelectedCity(data.infoSetting.city || "아산시");
      console.log("data 즐겨타는출발지:", data.infoSetting.favoriteStartPoint);
      // 위 로그로 data.infoSetting.favoriteStartPoint 이거는 잘 불러와진것같아 .
      setFavoriteStartLocation(data.infoSetting.favoriteStartPoint || ""); // 원래이럼
      // setFavoriteStartLocation(data.infoSetting.favoriteStartPoint); // 이렇게바꿔도 똑같고.

      console.log("data 즐겨타는 목적지:", data.infoSetting.favoriteEndPoint);
      setFavoriteEndLocation(data.infoSetting.favoriteEndPoint || "");
      setFavoriteTime1({
        hour: data.infoSetting.favoriteTimeFrame1.hour || "01",
        minute: data.infoSetting.favoriteTimeFrame1.minute || "00",
      });
      setFavoriteTime2({
        hour: data.infoSetting.favoriteTimeFrame2.hour || "01",
        minute: data.infoSetting.favoriteTimeFrame2.minute || "00",
      });
      // 데이터베이스에 아무 정보도 없으면 "" 빈 문자열 주기.
    } catch (error) {
      console.log("error retrieving details", error);
    }
  };

  useEffect(() => {
    viewTaxiMateInfo();
  }, []); //useEffect에 있는 []는 이 코드를 앱이 시작될 때 딱 한 번만 실행

  const handleStartLocationChange = (value) => {
    console.log("설정될 출발지:", value);
    setFavoriteStartLocation(value);
  };

  const handleEndLocationChange = (value) => {
    console.log("설정될 목적지:", value);
    setFavoriteEndLocation(value);
  };

  // const handleTime1Change = (value) => {
  //   setFavoriteTime1(value);
  // };

  // const handleTime2Change = (value) => {
  //   setFavoriteTime2(value);
  // };

  const handleReviewButtonClick = () => {
    // 리뷰 보기 버튼 클릭 시 실행할 코드 작성
  };

  const handleSaveButtonClick = () => {
    // 콘솔로그 잘들어갔는지.
    console.log("프론트엔드에 잘들어갔는지요.");
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

    //
    const userTaxiInfo = {
      userId: userId, // 로그인 한 사람 id
      province: selectedProvince, // 도
      city: selectedCity, // 시
      favoriteStartPoint: favoriteStartLocation, // 출발지,
      favoriteEndPoint: favoriteEndLocation, // 도착지
      favoriteTimeFrame1: [favoriteTime1.hour, favoriteTime1.minute], // 시간1
      favoriteTimeFrame2: [favoriteTime2.hour, favoriteTime2.minute], // 시간2
    };
    // 이 정보들을 서버로 전송하거나 다른 작업을 수행할 수 있습니다.

    // 유저택시정보저장
    axios
      .post("http://10.20.64.77:8000/setTaxiMateInfo", userTaxiInfo)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        // 오류발생시 실행
        console.log("이 오류 : ", error.message);
      });
  };

  return (
    <View>
      <Text>택시 동승자 정보</Text>
      {/* <Text>친구 ID: {friendId}</Text>        
      <Text>친구 이름: {friendName}</Text>  */}

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

      <Text> 즐겨타는 출발지 : {favoriteStartLocation} </Text>
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
        <Text> </Text>
        <View style={styles.locationIcon}>
          <MaterialCommunityIcons name="map-marker" size={20} />
        </View>
      </View>

      <Text> 즐겨타는 목적지 : {favoriteEndLocation}</Text>
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
            title="리뷰보기"
            onPress={handleReviewButtonClick}
            color="#28a745"
          />
        </View>
        <View style={{ width: 20 }} />
        <View style={styles.buttonWrapper}>
          <Button
            title="저장"
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

export default MyTaxiMateInfo;
