import { StyleSheet, Text, View } from "react-native";

const MyInfo = () => {
  return (
    <View style={styles.container}>
      <Text>내정보</Text>
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

export default MyInfo;
