import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useReducer, useRef } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  View,
  Keyboard,
  ScrollView,
} from "react-native";
import { AuthRoutes } from "../navigations/routes";
import Input, { ReturnKeyTypes, InputTypes } from "../components/Input";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SafeInputView from "../components/SafeInputView";
import TextButton from "../components/TextButton";
import Button from "../components/Button";
import HR from "../components/HR";

import { StatusBar } from "expo-status-bar";
import { WHITE } from "../colors";

import {
  authFormReducer,
  AuthFormTypes,
  initAuthForm,
} from "../reducers/authFormReducer"; //reducer 씀

import { getAuthErrorMessages, signIn } from "../api/auth";

import { useUserState } from "../contexts/UserContext";

const SignInScreen = () => {
  const passwordRef = useRef(); // 이건뭐지
  const navigation = useNavigation(); // 네비게이션 쓰겠따
  const { top, bottom } = useSafeAreaInsets(); // 위아래 핸드폰 기종마다 조금 안보이는거 방지.

  const [form, dispatch] = useReducer(authFormReducer, initAuthForm); // 모름

  const [, setUser] = useUserState();

  useFocusEffect(
    useCallback(() => {
      return () => dispatch({ type: AuthFormTypes.RESET });
    }, []) // 포커스 달라지면 타입전부 리셋
  ); //

  const updateForm = (payload) => {
    const newForm = { ...form, ...payload };
    const disabled = !newForm.email || !newForm.password; //모름

    dispatch({
      type: AuthFormTypes.UPDATE_FORM,
      payload: { disabled, ...payload }, //몰
    });
  };

  const onSubmit = async () => {
    Keyboard.dismiss(); // submit 버튼 누르면
    if (!form.disabled && !form.isLoading) {
      dispatch({ type: AuthFormTypes.TOGGLE_LOADING });
      try {
        console.log("로그인누름");
        const user = await signIn(form);
        setUser(user);
        console.log("로그인되어서 유저찍어보기", { user });
      } catch (e) {
        const message = getAuthErrorMessages(e.code);
        Alert.alert("로그인 실패", message, [
          {
            text: "확인",
            onPress: () => dispatch({ type: AuthFormTypes.TOGGLE_LOADING }),
          },
        ]);
      }
      dispatch({ type: AuthFormTypes.TOGGLE_LOADING });
    }
  };

  return (
    <SafeInputView>
      <StatusBar style="light" />
      <View style={[styles.container, { paddingTop: top }]}>
        <View style={StyleSheet.absoluteFill}>
          <Image
            source={require("../../assets/cover.jpg")}
            style={{ width: "100%" }}
            resizeMode="cover"
          />
        </View>

        <ScrollView
          style={[styles.form, { paddingBottom: bottom ? bottom + 10 : 40 }]}
          contentContainerStyle={{ alignItems: "center" }}
          bounces={false}
          keyboardShouldPersistTaps="always"
        >
          <Input
            value={form.email}
            onChangeText={(text) => updateForm({ email: text.trim() })} //몰
            inputType={InputTypes.EMAIL} //알
            ReturnKeyType={ReturnKeyTypes.NEXT} //알
            onSubmitEditing={() => passwordRef.current.focus()} //알 REF는 몰 뜻?
            styles={{ container: { marginBottom: 20 } }}
          />
          <Input
            ref={passwordRef}
            value={form.password}
            onChangeText={(text) => updateForm({ password: text.trim() })}
            inputType={InputTypes.PASSWORD}
            ReturnKeyType={ReturnKeyTypes.DONE}
            onSubmitEditing={onSubmit}
            styles={{
              container: { marginBottom: 20 },
            }}
          />
          <Button
            title="로그인"
            onPress={onSubmit}
            disabled={form.disabled}
            isLoading={form.isLoading}
            styles={{
              container: {
                marginTop: 20,
              },
            }}
          />
          <HR text={"OR"} styles={{ container: { marginVertical: 30 } }} />
          <TextButton
            title={"회원가입"}
            onPress={() => navigation.navigate(AuthRoutes.SIGN_UP)}
          />
        </ScrollView>
      </View>
    </SafeInputView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  form: {
    flexGrow: 0,
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default SignInScreen;
