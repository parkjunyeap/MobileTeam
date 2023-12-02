// DriverInfo.js
import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useContext, useEffect ,useState} from "react";
import { UserType } from "../UserContext";
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
  const [carNumber, setCarNumber] = useState("")
  const [carName, setCarName] = useState("")
  const [expirationDate, setExpirationDate] = useState("")

  useEffect(() => {
    const getMyTaxiInfo = async () => {
      try {
        const response = await fetch(
          `http://10.20.61.43:8000/getMyTaxiInfo/${userId}`
        );
        const data = await response.json(); // 택시 친구 정보 json 으로 가져옴 .
        // setRecepientData(data);
        //이런식으로 set 어쩌구 (data) 해주면될것같은데.

        console.log("불러온 data:", data);
        setEmail(data.email)
        setName(data.name)
        setImage(data.image)
        setImaget(data.imaget)
        setLicenseNumber(data.licenseNumber)
        setCarName(data.carName)
        setCarNumber(data.carNumber)
        setExpirationDate(data.expirationDate)

        // 데이터베이스에 아무 정보도 없으면 "" 빈 문자열 주기.
      } catch (error) {
        console.log("error retrieving details", error);
      }
    };

    getMyTaxiInfo();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>기사 정보</Text>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>프로필 사진이 없습니다</Text>
        )}
      </View>
      <View style={styles.imageContainer}>
        {imaget ? (
          <Image source={{ uri: imaget }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>자격증 사진이 없습니다</Text>
        )}
      </View>

      <Text style={styles.info}>자격증 번호: {licenseNumber}</Text>
      <Text style={styles.info}>이름: {name}</Text>
      <Text style={styles.info}>이메일: {email}</Text>
      <Text style={styles.info}>취득 날짜: {expirationDate}</Text>
      <Text style={styles.info}>차량 번호: {carNumber}</Text>
      <Text style={styles.info}>차량 명: {carName}</Text>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
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
    marginBottom: 20,
  },
  placeholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#a1a1a1',
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  }
});

export default DriverInfo;