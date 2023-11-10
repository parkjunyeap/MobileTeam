import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

const FriendsFindDetail = () => {
  const [selectedProvince, setSelectedProvince] = useState("강원도");

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

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FriendsFindDetail;
