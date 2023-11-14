import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

const FriendsFind = ({ navigation }) => {
  return (
    // 친구 찾기 누르면 친구 찾기 페이지로 이동
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("FriendsFindDetail")}
      >
        <Text style={styles.buttonText}>친구 찾기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    // Match the style with your design
    backgroundColor: "#4CAF50", // This is the green background
    padding: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    // Add other styles for your text if needed
  },
});

export default FriendsFind;
