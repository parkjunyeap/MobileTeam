// 앱의 시작점.
import { StyleSheet, Text, View } from "react-native";
import StackNavigator from "./navigations/StackNavigator";
import { UserContext } from "./UserContext";

export default function App() {
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
