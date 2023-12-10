import { StyleSheet, Text, View } from "react-native";
import StackNavigator from "./navigations/StackNavigator";
import { UserContext } from "./UserContext";
import registerNNPushToken from "native-notify";

export default function App() {
  registerNNPushToken(16556, "EUD53vLmHh5vU3iX2Rph5g"); // 토큰
  return (
    <>
      {/* 이런식으로 전역으로 감싸줌 */}
      <UserContext>
        <StackNavigator />
      </UserContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
