import { Button, StyleSheet, Text, View } from "react-native";

const LogIn = () => {
  return (
    <View style={styles.container}>
      <Button title={"구글로 로그인"} onPress={() => {}} />
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
