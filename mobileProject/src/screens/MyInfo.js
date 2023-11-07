import { StyleSheet, Text, View ,Image} from "react-native";

const MyInfo = ({ userData }) => {
  // userData를 사용해 사용자 정보를 표시합니다.
  // 예시로 이름과 이메일을 표시한다고 가정하겠습니다.
  return (
    <View>
      {userData && (
        <View>
          <Image
          source={{ uri: userData.photoURL }}
          style={styles.image}
        />
          <Text>이름 : {userData.displayName}</Text>
          <Text>이메일 : {userData.email}</Text>
        </View>
      )}
    </View>
  );
};
/*
const displayName = user.displayName;
  const email = user.email;
  const photoURL = user.photoURL;
  const emailVerified = user.emailVerified;

  // The user's ID, unique to the Firebase project. Do NOT use
  // this value to authenticate with your backend server, if
  // you have one. Use User.getToken() instead.
  const uid = user.uid;
   */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100, // Set the width
    height: 100, // and height of the image
    borderRadius: 50, // If you want to create a rounded image
  },
});

export default MyInfo;
