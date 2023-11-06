import { StyleSheet, Text, View } from "react-native";

const FriendsList = () => {
  return (
    <View style={styles.container}>
      <Text>친구목록</Text>
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

export default FriendsList;
