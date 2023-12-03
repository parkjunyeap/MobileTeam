// 유저 친구요청 , 요청보냄, 친구 , 그리고 리뷰남기기, 리뷰보기 등 하나의 컴포넌트에서 다 할 수 있음요.

import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View, Image, Pressable, Modal } from "react-native";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

const User = ({ item }) => {
  const { userId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false); // 요청 처음엔 실패
  // 현재 로그인 한 사람 누군지 알수있으려고
  const [friendRequests, sentFriendRequests] = useState([]); // 친구요청 보낸 유저배열
  const [userFriends, setUserFriends] = useState([]); // 친구인 유저 배열

  useEffect(() => {
    // 요청 보낸사람 이거
    const fetchFriendRequests = async () => {
      try {
        console.log("여기들옴?");
        const response = await fetch(
          `http://10.20.64.10:8000/friend-requests/sent/${userId}`
        );

        const data = await response.json();
        console.log("리스폰은 ", data);
        if (response.ok) {
          sentFriendRequests(data);
        } else {
          console.log("1 에러error", response.status);
        }
      } catch (error) {
        console.log("2 에러 error", error);
      }
    };
    fetchFriendRequests();
  }, []);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await fetch(
          `http://10.20.64.10:8000/friends/${userId}`
        );

        const data = await response.json();

        if (response.ok) {
          setUserFriends(data);
        } else {
          console.log("에러 친구", response.status);
        }
      } catch (error) {
        console.log("Error message", error);
      }
    };
    fetchUserFriends();
  }, []);

  console.log("친구 요청 보낸사람", friendRequests);
  console.log("친구인 사람", userFriends);

  const [modalVisible, setModalVisible] = useState(false);

  // console.log("이렇게하면 이름이나와?: ", userId);
  // 이럼설마 이름이나온다고???

  // navigation 쓰려면
  const navigation = useNavigation();

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://10.20.64.10:8000/friend-request", {
        // 친구추가 요청 보내기
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });
      console.log(currentUserId, selectedUserId); // 여기에서 친구요청보낼때 선택된 아이디가 뜨겠구나.

      // 선택은 잘되는데 오는게 잘안됨.
      if (response.ok) {
        setRequestSent(true);
        // 친구 요청이 성공적으로 완료되었다면, userFriends 상태 업데이트
        // setUserFriends((prevFriends) => [...prevFriends, selectedUserId]);
        console.log("ok 되서 잘 됐다고 뜸?");
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
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  { marginRight: 10, marginTop: 10 },
                  !userFriends.includes(item._id) && styles.buttonDisabled, // 친구가 아닐 때 스타일 추가
                ]}
                onPress={() => {
                  if (userFriends.includes(item._id)) {
                    navigation.navigate("writeReview", {
                      selectedUserId: item._id,
                      selectedUserName: item.name,
                    });
                  }
                }}
                disabled={!userFriends.includes(item._id)} // 친구가 아닐 때 버튼 비활성화
              >
                <Text style={styles.textStyle}>리뷰 남기기</Text>
              </Pressable>

              {/*  여기 서부터하자 */}

              <Pressable
                style={[styles.button, styles.buttonClose, { marginTop: 10 }]}
                onPress={() =>
                  navigation.navigate("ViewFriendReview", {
                    selectedUserId: item._id, // 이렇게하면 지금 selectedUserId 도 보내줄
                    selectedUserName: item.name, // 선택한 아이템의 이름도 보내줌
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
              source={{ uri: item?.image }}
            />
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text style={{ marginTop: 4, color: "gray" }}>{item.email}</Text>
          </View>
        </Pressable>

        {userFriends.includes(item._id) ? (
          <Pressable
            style={{
              backgroundColor: "#82CD47",
              padding: 10,
              width: 105,
              borderRadius: 6,
            }}
          >
            <Text style={{ textAlign: "center", color: "white" }}>친구</Text>
          </Pressable>
        ) : requestSent ||
          friendRequests.some((friend) => friend._id === item._id) ? (
          <Pressable
            style={{
              backgroundColor: "gray",
              padding: 10,
              width: 105,
              borderRadius: 6,
            }}
          >
            <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
              요청 보냄
            </Text>
          </Pressable>
        ) : (
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
        )}
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
