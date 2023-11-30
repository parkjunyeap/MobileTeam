// DriverInfo.js
import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

const DriverInfo = ({ route }) => {
  // route.params에서 정보를 추출합니다.
  // MyInfoStackNavigator를 통해 전달된 params가 있는지 확인합니다.
  const info = route.params || {};

  // 각 정보가 제공되지 않았을 경우를 대비해 기본값을 설정합니다.
  const {
    image = '기본 이미지 경로 또는 상태',
    licenseNumber = '정보 없음',
    name = '정보 없음',
    birthDate = '정보 없음',
    expirationDate = '정보 없음'
  } = info;

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.header}>기사 정보</Text>

    <View style={styles.imageContainer}>
      {image ? (
        <Image source={{ uri: 'data:image/jpeg;base64,' + image }} style={styles.image} />
      ) : (
        <Text style={styles.placeholderText}>자격증 사진이 없습니다</Text>
      )}
    </View>

    <Text style={styles.info}>자격증 번호: {licenseNumber}</Text>
    <Text style={styles.info}>이름: {name}</Text>
    <Text style={styles.info}>생년월일: {birthDate}</Text>
    <Text style={styles.info}>유효 기간: {expirationDate}</Text>
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