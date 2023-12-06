// 친구찾기 화면

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MultiSelect from "react-native-multiple-select";
import { MAP_KEY } from "../../env";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import TimePicker from "../components/TimePicker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { UserType } from "../UserContext";
import { useContext } from "react";
import locationData from "../locationData";

const FriendsFindDetail = () => {
  const { userId, setUserId } = useContext(UserType); // 여기서 유저 누구로 로그인햇는지 .

  // const [keyboardHeight, setKeyboardHeight] = useState(0); // 키보드 높이?

  console.log({ userId });

  const [selectedProvince, setSelectedProvince] = useState(
    Object.keys(locationData)[0]
  );
  const [selectedCity, setSelectedCity] = useState(
    locationData[Object.keys(locationData)[0]][0]
  );
  const [favoriteStartLocation, setFavoriteStartLocation] = useState([]);
  const [favoriteStartLocationI, setFavoriteStartLocationI] = useState([]);

  const [favoriteEndLocation, setFavoriteEndLocation] = useState([]);
  const [favoriteEndLocationI, setFavoriteEndLocationI] = useState([]);
  // // 키보드 화면 안가려지게 안되는데용?
  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     "keyboardDidShow",
  //     (e) => {
  //       setKeyboardHeight(e.endCoordinates.height);
  //     }
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     "keyboardDidHide",
  //     () => {
  //       setKeyboardHeight(0);
  //     }
  //   );

  //   return () => {
  //     keyboardDidHideListener.remove();
  //     keyboardDidShowListener.remove();
  //   };
  // }, []);

  const onProvinceChange = (province) => {
    setSelectedProvince(province);
    const citiesForProvince = locationData[province];
    setSelectedCity(citiesForProvince[0]);
  };

  const handleStartLocationChange = (start_place) => {
    setFavoriteStartLocation([...favoriteStartLocation, start_place]);
  };
  const handleStartLocationIChange = (items) => {
    setFavoriteStartLocationI(items);
  };

  const handleEndLocationChange = (end_place) => {
    setFavoriteEndLocation([...favoriteEndLocation, end_place]);
  };
  const handleEndLocationIChange = (items) => {
    setFavoriteEndLocationI(items);
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
    console.log(
      "즐겨타는 출발지:",
      favoriteStartLocation.map((item) => item.description)
    );
    console.log(
      "즐겨타는 목적지:",
      favoriteEndLocation.map((item) => item.description)
    );

    const findTaxiInfo = {
      userId: userId, // 로그인 한 사람 id
      province: selectedProvince, // 도
      city: selectedCity, // 시
      favoriteStartPoint: favoriteStartLocation.map((item) => item.description), // 출발지,
      favoriteEndPoint: favoriteEndLocation.map((item) => item.description),
    };

    // 데이터 다 저장해서 .,.,.

    console.log("서버로 보낼 상세 설정부분 :", findTaxiInfo);
    axios
      .post("http://10.20.34.124:8000/FindTaxiMateDetail", findTaxiInfo)
      .then(function (response) {
        //console.log(response);
        const userPCs = response.data.userPC;
        const userSEs = response.data.userSE;
        if (userPCs.length === 0 && userSEs.length === 0) {
          console.log("해당하는 사용자를 찾을 수 없습니다.");
        } else {
          console.log("검색된 유저들 전부 보여주게 배열을.", userPCs, userSEs); // users 배열 모든 값 해당하는애 출력하기.
          // 사용자 정보 배열을 순회하며 작업 수행
          userPCs.forEach((userPC) => {
            const userGId = userPC._id;
            const userName = userPC.name;
            if (userId !== userGId) {
              console.log("사용자 _id:", userGId);
              console.log("사용자 이름:", userName);
            }
          });
          userSEs.forEach((userSE) => {
            const userGId = userSE._id;
            const userName = userSE.name;
            if (userId !== userGId) {
              console.log("사용자 _id:", userGId);
              console.log("사용자 이름:", userName);
            }
          });
        }

        navigation.navigate("FriendsFindResult", { userPCs, userSEs });
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
    <ScrollView
      keyboardShouldPersistTaps="always"
      listViewDisplayed={false}
      // 위 코드는 스크롤뷰랑 구글오토컴플레이트 같이 쓸때 나오는 오류 없애려고 한거. 뭔지는 모름.
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
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

        <View style={styles.location}>
          <View style={{ flexDirection: "row" }}>
            <Text> 주 출발지 : </Text>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              style={{ left: -5, bottom: 3 }}
            />
          </View>
          <GooglePlacesAutocomplete
            placeholder="주 출발지를 적어주세요!"
            styles={{
              container: { flex: 1 },
              textInput: { paddingLeft: 20, height: 40 },
            }}
            onPress={(data, details) => handleStartLocationChange(data)}
            onFail={(e) => {
              console.log("GooglePlacesAutocomplete onFail : ", e);
            }}
            query={{ key: MAP_KEY, language: "ko", components: "country:kr" }}
            debounce={400}
          />
          <MultiSelect
            items={favoriteStartLocation}
            uniqueKey="place_id"
            onSelectedItemsChange={handleStartLocationIChange}
            selectedItems={favoriteStartLocationI}
            selectText="위에서 위치를 찾고 이곳을 눌러 검색에 추가하세요!!!"
            searchInputPlaceholderText="찾기"
            displayKey="description"
          />
          <Text>
            {favoriteStartLocationI.map((item) => (
              <Text key={item.place_id}>{item && item.description}</Text>
            ))}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text> 주 목적지 : </Text>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              style={{ left: -5, bottom: 3 }}
            />
          </View>
          <GooglePlacesAutocomplete
            placeholder="목적지를 적어주세요!"
            styles={{
              container: { flex: 0 },
              textInput: { paddingLeft: 20, height: 40 },
            }}
            onPress={(data, details) => handleEndLocationChange(data)}
            onFail={(e) => {
              console.log("GooglePlacesAutocomplete onFail : ", e);
            }}
            query={{ key: MAP_KEY, language: "ko", components: "country:kr" }}
            debounce={400}
          />
          <MultiSelect
            items={favoriteEndLocation}
            uniqueKey="place_id"
            onSelectedItemsChange={handleEndLocationIChange}
            selectedItems={favoriteEndLocationI}
            selectText="위에서 위치를 찾고 이곳을 눌러 검색에 추가하세요!!!"
            searchInputPlaceholderText="찾기"
            displayKey="description"
          />
          <Text>
            {favoriteEndLocationI.map((item) => (
              <Text key={item.place_id}>{item && item.description}</Text>
            ))}
          </Text>
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
        <View />
      </KeyboardAvoidingView>
    </ScrollView>
    // {/* </KeyboardAvoidingView> */}
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

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
    left: 0,
    top: 25,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginBottom: 30,
  },
  buttonWrapper: {
    flex: 1, // each button will take half of the container width
    borderRadius: 5, // slight roundness to the corners
    overflow: "hidden", // ensures the borderRadius is respected
  },
});

export default FriendsFindDetail;
