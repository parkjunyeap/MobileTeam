// 앱의 시작점.
import registerNNPushToken from "native-notify"; // 알림
import { StyleSheet, Text, View } from "react-native";
import StackNavigator from "./navigations/StackNavigator";
import { UserContext } from "./UserContext";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews",
]);

// 이 에러가 기능 구현엔 문제가없는 것같은데 자꾸 떠서.

export default function App() {
  registerNNPushToken(16556, "EUD53vLmHh5vU3iX2Rph5g");
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
