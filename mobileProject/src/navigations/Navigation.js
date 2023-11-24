import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./AuthStack";
import { initFirebase } from "../api/firebase";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useUserState } from "../contexts/UserContext";
import BottomTabNavigator from "./BottomTabNavigator";

import { onAuthStateChanged } from "../api/auth";

const ImageAssets = [
  require("../../assets/cover.jpg"),

  require("../../assets/icon.png"),
];

const Navigation = () => {
  const [user, setUser] = useUserState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      // 비동기이기 때문에 async-await 사용해서 호출해야함.
      try {
        await SplashScreen.preventAutoHideAsync(); // splash 이미지 화면에 계속 보여주는 함수
        // try 문에서 많은 작업하면 보여주는 시간이길어짐.
        await Promise.all(
          ImageAssets.map((image) => Asset.fromModule(image).downloadAsync)
        ); // 잘몰 670p

        await Asset.fromModule(
          require("../../assets/cover.jpg")
        ).downloadAsync();

        const unsubscribe = onAuthStateChanged((user) => {
          if (user) {
            setUser(user);
          }
          setIsReady(true);
          unsubscribe();
        });
      } catch (e) {
        //  eslint-disable-next-line no-console
        console.log(e);
        setIsReady(true);
      }
    })();
  }, [setUser]);

  // useEffect 공부 더필요 async await 비동기방식 공부필요

  const onReady = async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }; // 화면이 준비되었는지 확인해야되서 씀. NavigationContainer 컴포넌트에 onReady props가 있음. 마운트되거나
  // 레이아웃변경됐을ㄷ떄 호출되서, 컴포넌트를 화면에 보여줄 준비가 완료되었다는것을 알수 있음.

  if (!isReady) {
    return null;
  }

  const app = initFirebase();

  return (
    <NavigationContainer onReady={onReady}>
      {user.uid ? <BottomTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Navigation;
