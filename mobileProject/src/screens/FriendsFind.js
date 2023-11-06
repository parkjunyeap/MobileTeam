import { StyleSheet, Text, View } from "react-native";

const FriendsFInd = () => {
  return (
    <View style={styles.container}>
      <Text>친구찾기</Text>
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

export default FriendsFInd;
