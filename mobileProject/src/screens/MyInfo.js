<<<<<<< HEAD
import { StyleSheet, Text, View ,Image} from "react-native";

const MyInfo = ({ userData }) => {
  // userData를 사용해 사용자 정보를 표시합니다.
  // 예시로 이름과 이메일을 표시한다고 가정하겠습니다.
  return (
    <View>
      {userData && (
        <View>
          <Image
          source={{ uri: userData.photoURL }}
          style={styles.image}
        />
          <Text>이름 : {userData.displayName}</Text>
          <Text>이메일 : {userData.email}</Text>
        </View>
      )}
    </View>
  );
};
/*
const displayName = user.displayName;
  const email = user.email;
  const photoURL = user.photoURL;
  const emailVerified = user.emailVerified;
=======
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

function MyInfo({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>내정보</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ReviewTaxiMyInfo")}
      >
        <Text style={styles.buttonText}>택시기사리뷰</Text>
      </TouchableOpacity>
      <View style={styles.separator} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ReviewTaxiMateMyInfo")}
      >
        <Text style={styles.buttonText}>택시탑승자리뷰</Text>
      </TouchableOpacity>
      <View style={styles.separator} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MyTaxiMateInfo")}
      >
        <Text style={styles.buttonText}>택시 친구 정보</Text>
      </TouchableOpacity>
      <View style={styles.separator} />

      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PaymentDetails")}
      >
        <Text style={styles.buttonText}>결제 내역</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Review")}
      >
        <Text style={styles.buttonText}>리뷰</Text>
      </TouchableOpacity>
    </View>
  );
}
>>>>>>> Parkjunyeop

  // The user's ID, unique to the Firebase project. Do NOT use
  // this value to authenticate with your backend server, if
  // you have one. Use User.getToken() instead.
  const uid = user.uid;
   */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start", // 이 부분을 변경했습니다.
    justifyContent: "center",
    paddingLeft: 10, // 컨테이너 왼쪽에 패딩을 추가하여 내용이 화면 가장자리에 바로 붙지 않도록 합니다.
  },
  // 나머지 스타일은 이전과 동일합니다.
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    marginBottom: 10,
    padding: 10,
    alignSelf: "stretch", // 각 TouchableOpacity가 컨테이너의 전체 너비를 차지하도록 합니다.
  },
  buttonText: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  separator: {
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    margin: 10,
  },
  image: {
    width: 100, // Set the width
    height: 100, // and height of the image
    borderRadius: 50, // If you want to create a rounded image
  },
});

export default MyInfo;
