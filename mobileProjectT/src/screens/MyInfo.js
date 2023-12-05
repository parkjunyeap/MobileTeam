import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

function MyInfo({ navigation }) {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>내정보</Text> */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("DriverInfo")}
      >
        <Text style={styles.buttonText}>기사 정보</Text>
      </TouchableOpacity>
      <View style={styles.separator} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PaymentListDriver")}
      >
        <Text style={styles.buttonText}>결제 내역</Text>
      </TouchableOpacity>
      <View style={styles.separator} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ViewBookingDriver")}
      >
        <Text style={styles.buttonText}>예약 내역</Text>
      </TouchableOpacity>
    </View>
  );
}

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
});

export default MyInfo;
