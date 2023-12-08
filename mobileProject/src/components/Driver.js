// 깡통

import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View, Image, Pressable, Modal } from "react-native";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

const Driver = ({ item }) => {
  // 모달 쓰려면.
  const [modalVisible, setModalVisible] = useState(false);
  // navigation 쓰려면
  const navigation = useNavigation();
  // 화면 이동할 때 모달 상태꺼지게하려고 gpt 가 작성해줌 진짜 되네  addListener focus 를 활용해서 할수있음.
  // 원래는 화면 이동했다가 다시 뒤로와서 화면터치해봤는데 보이지않는 투명 모달 떄문에 터치가 안됐음.

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // 필요한 로직 추가
      setModalVisible(false); // 모달 상태를 비활성화
    });

    // 화면을 떠날 때 모달 꺼지게.
    return unsubscribe;
  }, [navigation]);

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
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  resizeMode: "cover",
                }}
                source={{ uri: item?.image }}
                // ㅇ처음엔 사진
              />
            </View>
            <Text style={styles.modalText}> {item.name}</Text>

            <Text> 이메일 : {item.email}</Text>

            <Text>
              운행하시는 동네 :
              {item.province === undefined && item.city === undefined
                ? "입력안함"
                : item.province + " " + item.city}
            </Text>

            <Text>
              차량 번호 :
              {item.carNumber === undefined ? "입력안함" : item.carNumber}
            </Text>

            <Text>
              차종 :{item.carName === undefined ? "입력안함" : item.carName}
            </Text>
            <Text>
              자격증명넘버 :
              {item.licenseNumber === undefined
                ? "입력안함"
                : item.licenseNumber}
            </Text>
            <Text>
              자격증 습득 날짜 :
              {item.getDate === undefined ? "입력안함" : item.getDate}
            </Text>

            <Text>
              운행 상태 :{item.driveState === true ? "운행중" : "쉬는중"}
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
                  // !userFriends.includes(item._id) && styles.buttonDisabled, // 친구가 아닐 때 스타일 추가
                ]}
                onPress={() => {
                  navigation.navigate("writeReview", {
                    selectedDriverId: item._id, // 사실 드라이버 아이디 ,
                    selectedDriverName: item.name, //사실 드라이버 이름
                  });
                }}
              >
                <Text style={styles.textStyle}>리뷰 남기기</Text>
                {/* 리뷰 남기기는 되는것같은데??? */}
              </Pressable>

              {/*  여기 서부터하자 */}

              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  { marginRight: 10, marginTop: 10 },
                ]}
                onPress={() =>
                  navigation.navigate("ViewFriendReview", {
                    // 뷰 프렌드 리뷰로 감 일단 //
                    selectedDriverId: item._id, // 이렇게하면 지금 selectedUserId 도 보내줄 // 사실 드라이버 아이디 ,
                    selectedDriverName: item.name, // 선택한 아이템의 이름도 보내줌 //사실 드라이버 이름
                  })
                }
              >
                <Text style={styles.textStyle}>리뷰 보기</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonClose, { marginTop: 10 }]}
                onPress={() =>
                  navigation.navigate("BookingTaxiDriver", {
                    // 뷰 프렌드 리뷰로 감 일단 //
                    selectedDriverId: item._id, // 이렇게하면 지금 selectedUserId 도 보내줄 // 사실 드라이버 아이디 ,
                    selectedDriverName: item.name, // 선택한 아이템의 이름도 보내줌 //사실 드라이버 이름
                  })
                }
              >
                <Text style={styles.textStyle}>예약</Text>
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
        <Pressable // 사진, 이름, 이메일 쪽 누르면. 모달창 보임
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
              // ㅇ처음엔 사진
            />
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            {/* 이름 */}
            <Text style={{ marginTop: 4, color: "gray" }}>{item.email}</Text>
            {/* 이메일 보이게 */}
          </View>
        </Pressable>
      </View>
    </>
  );
};

export default Driver;

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
