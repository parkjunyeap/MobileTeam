import { StyleSheet, Text, View } from "react-native";

const Chatting = () => {
  return (
    <View style={styles.container}>
      <Text>채팅</Text>
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

export default Chatting;
