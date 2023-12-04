// DriverInfo.js
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import locationData from "../locationData";

const DriverInfo = ({ route }) => {
  // route.params에서 정보를 추출합니다.
  // MyInfoStackNavigator를 통해 전달된 params가 있는지 확인합니다.
  const info = route.params || {};
  const { userId, setUserId } = useContext(UserType);
  // 각 정보가 제공되지 않았을 경우를 대비해 기본값을 설정합니다.
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imaget, setImaget] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [carName, setCarName] = useState("");
  const [getDate, setGetDate] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [selectedProvince, setSelectedProvince] = useState(
    Object.keys(locationData)[0]
  );
  const [selectedCity, setSelectedCity] = useState(
    locationData[Object.keys(locationData)[0]][0]
  );

  useEffect(() => {
    const getMyTaxiInfo = async () => {
      try {
        const response = await fetch(
          `http://10.20.61.21:8000/getMyTaxiInfo/${userId}`
        );
        const data = await response.json(); // 택시 친구 정보 json 으로 가져옴 .
        // setRecepientData(data);
        //이런식으로 set 어쩌구 (data) 해주면될것같은데.

        console.log("불러온 data:", data);
        setEmail(data.email);
        setName(data.name);
        setImage(data.image);
        setImaget(data.imaget);
        setLicenseNumber(data.licenseNumber);
        setCarName(data.carName);
        setCarNumber(data.carNumber);
        setGetDate(data.getDate);
        setBirthdate(data.birthdate);
        setSelectedProvince(data.province);
        setSelectedCity(data.city);

        // 데이터베이스에 아무 정보도 없으면 "" 빈 문자열 주기.
      } catch (error) {
        console.log("error retrieving details", error);
      }
    };

    getMyTaxiInfo();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleTimage = () => {
    const newTInfo = {
      userId: userId,
      image: image,
      birthdate: birthdate,
      province: selectedProvince,
      city: selectedCity,
    };
    axios
      .post("http://10.20.61.21:8000/UpTInfo", newTInfo) // 로컬호스트/8000번으로 레지스터 Url, user 객체를줌
      .then((response) => {
        // 그러면. res 로 잘됏나 안됏나 받음. 그리고 메시지띄움. 그리고 set으로 다른거 다 빈칸으로만듬
        console.log(response);
        Alert.alert("수정 성공!!", "성공적으로 수정되었습니다");
      })
      .catch((error) => {
        // 에러 받고 출력
        Alert.alert("수정 오류!!", "수정하는 동안 오류가 발생했습니다");
        console.log("update failed", error);
      });
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>기사 정보</Text>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.placeholderText}>프로필 사진이 없습니다</Text>
          )}
        </View>
      </TouchableOpacity>
      <Text style={styles.info}>이름: {name}</Text>
      <Text style={styles.info}>이메일: {email}</Text>
      <Text style={styles.info}>생년월일: {birthdate}</Text>
      <Text style={{ fontSize: 20, marginBottom: 5 }}> 택시 운행 지역 </Text>
      {/* Province Picker */}

      <Picker
        selectedValue={selectedProvince}
        onValueChange={(itemValue) => setSelectedProvince(itemValue)}
        style={{ height: 50, width: 250, marginBottom: 10 }}
      >
        {Object.keys(locationData).map((province) => (
          <Picker.Item key={province} label={province} value={province} />
        ))}
      </Picker>

      <Picker
        selectedValue={selectedCity}
        onValueChange={(itemValue) => setSelectedCity(itemValue)}
        style={styles.picker}
      >
        {locationData[selectedProvince]?.map((city) => (
          <Picker.Item key={city} label={city} value={city} />
        ))}
      </Picker>

      <View style={styles.imageContainer}>
        {imaget ? (
          <Image source={{ uri: imaget }} style={styles.imaget} />
        ) : (
          <Text style={styles.placeholderText}>자격증 사진이 없습니다</Text>
        )}
      </View>
      <Text style={styles.info}>자격증 번호: {licenseNumber}</Text>
      <Text style={styles.info}>취득 날짜: {getDate}</Text>
      <Text style={styles.info}>차량 번호: {carNumber}</Text>
      <Text style={styles.info}>차량 명: {carName}</Text>
      <Pressable
        onPress={handleTimage}
        // onPress={() => {}}
        style={{
          width: 200,
          backgroundColor: "#4A55A2",
          padding: 15,
          marginTop: 50,
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: 6,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          수정하기
        </Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 30,
    marginBottom: 30,
  },
  imaget: {
    width: 360,
    height: 180,
    marginTop: 30,
    marginBottom: 20,
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
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  placeholderText: {
    textAlign: "center",
    color: "#a1a1a1",
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
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
});

export default DriverInfo;
