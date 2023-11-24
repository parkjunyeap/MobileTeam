import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged as onAuthStateChangedFirebase,
  signOut as signOutFirebase,
  updateProfile,
} from "firebase/auth";

export const signOut = async () => {
  await signOutFirebase(getAuth());
};

const PHOTO_URL =
  "https://firebasestorage.googleapis.com/v0/b/rn-photo-55b67.appspot.com/o/profile.png?alt=media"; // 파이어베이스에 올려둔 것

export const signUp = async ({ email, password }) => {
  const { user } = await createUserWithEmailAndPassword(
    getAuth(),
    email,
    password
  );

  // 생성유저 이메일과 비밀번호

  await updateUserInfo({
    displayName: email.split("@")[0].slice(0, 10), // email 주소의 앞부분만
    photoURL: PHOTO_URL, // 업로드한 이미지주소
  });

  return user;
};

// 에러코드 나오게하기
export const getAuthErrorMessages = (errorCode) => {
  switch (errorCode) {
    case AuthErrorCodes.USER_DELETED:
      return "계정을 찾을 수 없습니다.";
    case AuthErrorCodes.INVALID_EMAIL:
      return "유효하지 않은 이메일 주소입니다.";
    case AuthErrorCodes.INVALID_PASSWORD:
      return "잘못된 비밀번호입니다.";
    case AuthErrorCodes.EMAIL_EXISTS:
      return "이미 가입된 이메일 입니다!";
    case AuthErrorCodes.WEAK_PASSWORD:
      return "비밀번호는 최소 6자리입니다!";
    default:
      return "로그인에 실패했습니다.";
  }
};

// 로그인 기능
export const signIn = async ({ email, password }) => {
  const { user } = await signInWithEmailAndPassword(getAuth(), email, password);
  return user;
};

// 로그인이나 회원가입 성공해서 프로필화면왔을때, 새로고침하면 로그인화면으로 풀림. 이걸 유지시켜주려면
// onAuthStateChanged
export const onAuthStateChanged = (callback) => {
  return onAuthStateChangedFirebase(getAuth(), callback);
};

// 로그인

export const updateUserInfo = async (userInfo) => {
  try {
    await updateProfile(getAuth().currentUser, userInfo);
  } catch (e) {
    throw new Error("사용자정보 수정에 실패 했습니다.");
  }
};
