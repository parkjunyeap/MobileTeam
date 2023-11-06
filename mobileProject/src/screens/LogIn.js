import { StyleSheet, Text, View } from "react-native";

const LogIn = () => {
  return (
    <View style={styles.container}>
      <Text>로그인</Text>
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

export default LogIn;
