import { useNavigation } from "@react-navigation/native";
import { useReducer, useRef } from "react";
import {
  ScrollView,
  Image,
  StyleSheet,
  View,
  Keyboard,
  Text,
  Alert,
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

import { getAuthErrorMessages, signUp } from "../api/auth";
import { useUserState } from "../contexts/UserContext";

const SignUpScreen = () => {
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [passwordConfirm, setPasswordConfirm] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  // const [disabled, setDisabled] = useState(true);

  // 원래이렇게 useState로 상태관리했는데,,,

  const [form, dispatch] = useReducer(authFormReducer, initAuthForm);

  // useEffect(() => {
  //   setDisabled(!(email && password && passwordConfirm));
  // }, [email, password, passwordConfirm]);

  const [, setUser] = useUserState();

  // 회원가입 버튼 활성화 비활성화
  const updateForm = (payload) => {
    const newForm = { ...form, ...payload };
    const disabled =
      !newForm.email ||
      !newForm.password ||
      newForm.password !== newForm.passwordConfirm;

    dispatch({
      type: AuthFormTypes.UPDATE_FORM,
      payload: { disabled, ...payload },
    });
  };

  // 버튼 누르면
  const onSubmit = async () => {
    Keyboard.dismiss();
    if (!form.disabled && !form.isLoading) {
      dispatch({ type: AuthFormTypes.TOGGLE_LOADING });
      try {
        const user = await signUp(form);
        setUser(user);
      } catch (e) {
        const message = getAuthErrorMessages(e.code);
        Alert.alert("회원가입 실패", message, [
          {
            text: "확인",
            onPress: () => dispatch({ type: AuthFormTypes.TOGGLE_LOADING }), //
          },
        ]);
      }
      console.log(form.email, form.password);
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
            onChangeText={(text) => updateForm({ email: text.trim() })}
            inputType={InputTypes.EMAIL}
            ReturnKeyType={ReturnKeyTypes.NEXT}
            onSubmitEditing={() => passwordRef.current.focus()}
            styles={{ container: { marginBottom: 20 } }}
          />

          <Input
            ref={passwordRef}
            value={form.password}
            onChangeText={(text) => updateForm({ password: text.trim() })}
            inputType={InputTypes.PASSWORD}
            ReturnKeyType={ReturnKeyTypes.NEXT}
            onSubmitEditing={() => passwordConfirmRef.current.focus()}
            styles={{
              container: { marginBottom: 20 },
            }}
          />
          <Input
            ref={passwordConfirmRef}
            value={form.passwordConfirm}
            onChangeText={(text) =>
              updateForm({ passwordConfirm: text.trim() })
            }
            inputType={InputTypes.PASSWORD_CONFIRM}
            ReturnKeyType={ReturnKeyTypes.DONE}
            onSubmitEditing={onSubmit}
            styles={{
              container: { marginTop: 20 },
            }}
          />
          <Button
            title="회원가입"
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
          <TextButton title={"로그인"} onPress={navigation.goBack} />
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

export default SignUpScreen;
