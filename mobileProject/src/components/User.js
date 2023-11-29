// import { StyleSheet, Text, View, Image } from "react-native";
// import React from "react";
// import { Pressable } from "react-native";
// import { useContext, useState } from "react";
// import { UserType } from "../UserContext";

// const User = ({ item }) => {
//   const { userId, setUserId } = useContext(UserType);
//   const [requestSent, setRequestSent] = useState(false); // 요청 처음엔 실패
//   // 현재 로그인 한 사람 누군지 알수있으려고
//   const sendFriendRequest = async (currentUserId, selectedUserId) => {
//     try {
//       const response = await fetch("http://10.20.32.74:8000/friend-request", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ currentUserId, selectedUserId }),
//       });

//       if (response.ok) {
//         setRequestSent(true);
//       }
//     } catch (error) {
//       console.log("error message", error);
//     }
//   };

//   return (
//     <View
//       style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
//     >
//       <View>
//         <Image
//           style={{
//             width: 50,
//             height: 50,
//             borderRadius: 25,
//             resizeMode: "cover",
//           }}
//           source={{ uri: item.Image }}
//         />
//       </View>

//       <View style={{ marginLeft: 12, flex: 1 }}>
//         <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
//         <Text style={{ marginTop: 4, color: "gray" }}>{item?.email}</Text>
//       </View>

//       <Pressable
//         onPress={() => sendFriendRequest(userId, item._id)}
//         style={{
//           backgroundColor: "#567189",
//           padding: 10,
//           borderRadius: 6,
//           width: 105,
//         }}
//       >
//         <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
//           친구 추가
//         </Text>
//       </Pressable>
//     </View>
//   );
// };

// export default User;

// const styles = StyleSheet.create({});

// 위가 1 // 모달 추가 전

import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, Image, Pressable, Modal } from "react-native";
import { UserType } from "../UserContext";

const User = ({ item }) => {
  const { userId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false); // 요청 처음엔 실패
  // 현재 로그인 한 사람 누군지 알수있으려고
  const [modalVisible, setModalVisible] = useState(false);

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://10.20.32.74:8000/friend-request", {
        // 친구추가 요청 보내기
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });

      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("error message", error);
    }
  };

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

            {/* // 이거되면 개소름 */}
            <Pressable
              style={[styles.button, styles.buttonClose]}
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
