import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View, Image, Pressable, Modal } from "react-native";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

const User = ({ item }) => {
  const { userId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false); // 요청 처음엔 실패
  // 현재 로그인 한 사람 누군지 알수있으려고
  const [modalVisible, setModalVisible] = useState(false);

  // console.log("이렇게하면 이름이나와?: ", userId);
  // 이럼설마 이름이나온다고???

  // navigation 쓰려면
  const navigation = useNavigation();

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://10.20.64.226:8000/friend-request", {
        // 친구추가 요청 보내기
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });
      console.log(currentUserId, selectedUserId); // 여기에서 친구요청보낼때 선택된 아이디가 뜨겠구나.

      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("error message", error);
    }
  };

  // 화면 이동할 때 모달 상태꺼지게하려고 gpt 가 작성해줌 진짜 되네  addListener focus 를 활용해서 할수있음.
  // 원래는 화면 이동했다가 다시 뒤로와서 화면터치해봤는데 보이지않는 투명 모달 떄문에 터치가 안됐음.
  useEffect(() => {
    // 화면에 진입할 때 실행
    const unsubscribe = navigation.addListener("focus", () => {
      // 필요한 로직 추가
      setModalVisible(false); // 모달 상태를 비활성화
    });

    // 화면을 떠날 때 실행
    return unsubscribe;
  }, [navigation]);

  // console.log(item.infoSetting.province);
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}> {item.name}</Text>
            <Text> 이메일 : {item.email}</Text>
            {/* <Text>{item.infoSetting.province || "null"}</Text> */}
            <Text>
              택시타는 동네 :
              {item.infoSetting === undefined
                ? "입력안함"
                : item.infoSetting.province + " " + item.infoSetting.city}
            </Text>

            <Text>
              즐겨 타는 출발지 :
              {item.infoSetting === undefined
                ? "입력안함"
                : item.infoSetting.favoriteStartPoint}
            </Text>
            <Text>
              즐겨 가는 목적지 :
              {item.infoSetting === undefined
                ? "입력안함"
                : item.infoSetting.favoriteEndPoint}
            </Text>
            <Text>
              즐겨 타는 시간대 1 :
              {item.infoSetting === undefined
                ? "입력안함"
                : item.infoSetting.favoriteTimeFrame1.hour +
                  " : " +
                  item.infoSetting.favoriteTimeFrame1.minute}
            </Text>
            <Text>
              즐겨 타는 시간대 2 :
              {item.infoSetting === undefined
                ? "입력안함"
                : item.infoSetting.favoriteTimeFrame2.hour +
                  " : " +
                  item.infoSetting.favoriteTimeFrame2.minute}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* // 리뷰 남기기 창 */}

              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  { marginRight: 10, marginTop: 10 },
                ]}
                onPress={() =>
                  navigation.navigate("writeReview", {
                    selectedUserId: item._id, // 이렇게하면 지금 selectedUserId 도 보내줄
                    selectedUserName: item.name, // 선택한 아이템의 이름도 보내줌
                  })
                }
              >
                <Text style={styles.textStyle}>리뷰 남기기</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonClose, { marginTop: 10 }]}
                onPress={() =>
                  navigation.navigate("ViewFriendReview", {
                    selectedUserId: item._id, // 이렇게하면 지금 selectedUserId 도 보내줄
                    // selectedUserName: item.name, // 선택한 아이템의 이름도 보내줌
                  })
                }
              >
                <Text style={styles.textStyle}>리뷰 보기</Text>
              </Pressable>
            </View>

            {/* // 그냥 닫기 */}
            <Pressable
              style={[styles.button, styles.buttonClose, , { marginTop: 10 }]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Pressable
          style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
          onPress={() => setModalVisible(true)}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                resizeMode: "cover",
              }}
              source={{ uri: item.Image }}
            />
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text style={{ marginTop: 4, color: "gray" }}>{item.email}</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => sendFriendRequest(userId, item._id)}
          style={{
            backgroundColor: "#567189",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            친구 추가
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default User;

// 스타일을 추가하거나 수정하세요.
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
