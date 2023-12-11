// 내 정보 택시메이트

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Alert,
  TouchableOpacity,
  Button,
  Image,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// 즐겨타는 출발지 , 목적지 자동완성
import { MAP_KEY } from "../../env";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import TimePicker from "../components/TimePicker";
import axios from "axios";

import { UserType } from "../UserContext";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import locationData from "../locationData";

// 지역 2차원배열 로된거 갖고옴

const MyTaxiMateInfo = () => {
  // 이렇게하면 로그인한유저 갖고올 수 있음.
  const { userId, setUserId } = useContext(UserType);

  // Firebase 앱 초기화
  const app = initializeApp(firebaseConfig);

  // Firebase Storage 인스턴스 얻기
  const storage = getStorage(app);

  console.log("여기에 로그인한사람 떠야함. 마이택시인포 ", userId);
  // 이렇게 하면 !!!!!!!!!!
  // 지금 로그인한 사용자의 userId 를 받아올 수 있네.
  const navigation = useNavigation();
  const [name, setName] = useState("박준엽");
  const [image, setImage] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(
    Object.keys(locationData)[0]
  );
  const [selectedCity, setSelectedCity] = useState(
    locationData[Object.keys(locationData)[0]][0]
  );
  const [favoriteStartLocation, setFavoriteStartLocation] = useState(""); // 아산
  const [favoriteEndLocation, setFavoriteEndLocation] = useState(""); //천안

  const [favoriteTime1, setFavoriteTime1] = useState({
    hour: "01",
    minute: "00",
  });
  const [favoriteTime2, setFavoriteTime2] = useState({
    hour: "01",
    minute: "00",
  });

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const imageName = asset.uri.substring(asset.uri.lastIndexOf("/") + 1);

        const response = await fetch(asset.uri);
        const blob = await response.blob();

        //const storage = getStorage(); // Firebase Storage 인스턴스를 얻어옵니다.
        const storageRef = ref(storage, `rn-photo/${imageName}`); // storageRef 생성
        await uploadBytes(storageRef, blob); // 파일 업로드

        const downloadURL = await getDownloadURL(storageRef); // 업로드한 파일의 다운로드 URL 얻기
        setImage(downloadURL);
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  const onProvinceChange = (province) => {
    setSelectedProvince(province);
    const citiesForProvince = locationData[province];
    setSelectedCity(citiesForProvince[0]);
  };

  // 서버에서 택시친구 정보 갖고오기
  const viewTaxiMateInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/ViewTaxiMateInfo/${userId}`
      );

      const data = await response.json(); // 택시 친구 정보 json 으로 가져옴 .
      // setRecepientData(data);
      //이런식으로 set 어쩌구 (data) 해주면될것같은데.

      console.log("불러온 data:", data);
      setName(data.name);
      setImage(data.image);
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

  const handleReviewButtonClick = () => {
    navigation.navigate("ViewMyReview");
    // 나한테 온 리뷰 보기임.
    // 리뷰 보기 버튼 클릭 시 실행할 코드 작성
  };
  useEffect(() => {
    const viewTaxiMateInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/ViewTaxiMateInfo/${userId}`
        );

        const data = await response.json(); // 택시 친구 정보 json 으로 가져옴 .
        // setRecepientData(data);
        //이런식으로 set 어쩌구 (data) 해주면될것같은데.

        console.log("불러온 data:", data);
        setSelectedProvince(data.infoSetting.province || "충청남도");
        setSelectedCity(data.infoSetting.city || "아산시");
        console.log(
          "data 즐겨타는출발지:",
          data.infoSetting.favoriteStartPoint
        );
        setFavoriteStartLocation(data.infoSetting.favoriteStartPoint || ""); // 원래이럼
        // setFavoriteStartLocation(data.infoSetting.favoriteStartPoint); // 이렇게바꿔도 똑같고.
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

    viewTaxiMateInfo();
  }, []); //useEffect에 있는 []는 이 코드를 앱이 시작될 때 딱 한 번만 실행
  const handleSaveButtonClick = () => {
    const userTaxiInfo = {
      userId: userId, // 로그인 한 사람 id
      image: image,
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
      .post("http://localhost:8000/setTaxiMateInfo", userTaxiInfo)
      .then(function (response) {
        //console.log(response);
        Alert.alert(
          "사용자 택시 정보 저장 성공!!",
          "성공적으로 저장되었습니다"
        );
      })
      .catch(function (error) {
        // 오류발생시 실행
        console.log("이 오류 : ", error.message);
        Alert.alert("알수없는 오류");
      });
  };
  return (
    <ScrollView>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.placeholder}>프로필 사진이 없습니다</Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}> 이름: {name} </Text>
          <Text style={styles.regionText}> 택시타는 동네: {selectedCity} </Text>
        </View>
      </View>

      <Picker
        selectedValue={selectedProvince}
        onValueChange={(itemValue) => onProvinceChange(itemValue)}
        style={{ height: 50, width: 250, marginBottom: 10 }}
      >
        {Object.keys(locationData).map((province) => (
          <Picker.Item key={province} label={province} value={province} />
        ))}
      </Picker>
      {/* City Picker */}

      <Picker
        selectedValue={selectedCity}
        onValueChange={(itemValue) => setSelectedCity(itemValue)}
        style={styles.picker}
      >
        {locationData[selectedProvince].map((city) => (
          <Picker.Item key={city} label={city} value={city} />
        ))}
      </Picker>

      <Text style={{ fontSize: 20, marginBottom: 5 }}> 즐겨타는 출발지 </Text>
      <Text> {favoriteStartLocation} </Text>
      <View style={styles.location}>
        <GooglePlacesAutocomplete
          listViewDisplayed="auto" // 오류 안뜨게 해줄려고 뭔 뜻 뭔기능인지 모르겠음
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

      <Text style={{ fontSize: 20, marginBottom: 5 }}> 즐겨타는 목적지 </Text>
      <Text> {favoriteEndLocation}</Text>
      <View style={styles.location}>
        <GooglePlacesAutocomplete
          listViewDisplayed="auto" // 오류 안뜨게 해줄려고 뭔 뜻 뭔기능인지 모르겠음
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  picker: {
    height: 50,
    width: 250,
    marginBottom: 20, // Picker들 사이의 간격을 조정
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 30,
    marginBottom: 30,
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
  placeholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 23,
    marginBottom: 5,
  },
  regionText: {
    fontSize: 20,
  },
});

export default MyTaxiMateInfo;
