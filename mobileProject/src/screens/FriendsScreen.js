import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";
import axios from "axios";
import FriendRequest from "../components/FriendRequest";

// 나에게온 친구요청 확인하는 화면
const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  // userId 지금 로그인한 갖고옴

  const [friendRequests, setFriendRequests] = useState([]);
  // 배열로 친구요청온거 [id, name, email, image] 이렇게하나씩 저장.
  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://10.20.60.238:8000/friend-request/${userId}`
      );
      if (response.status === 200) {
        const friendRequestsData = response.data.map((freindRequest) => ({
          _id: freindRequest._id, // oeqwjewqorherewarerId.name
          name: freindRequest.name,
          email: freindRequest.email,
          image: freindRequest.image,
        }));

        setFriendRequests(friendRequestsData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log("나한테 친구요청을 보낸 친구의 정보 :", friendRequests);

  return (
    <View style={{ padding: 10, marginHorizontal: 12 }}>
      {friendRequests.length === 0 && (
        <Text style={{ fontSize: 25 }}> 친구 요청이 하나도 없습니다..</Text>
      )}
      {friendRequests.length > 0 && <Text> 친구 요청</Text>}

      {friendRequests.map((item, index) => (
        <FriendRequest
          key={index} // 각 친구 요청을 나타내는 컴포넌트에 키 할당
          item={item} // 친구 요청 데이터
          friendRequests={friendRequests} // 전체 친구 요청 목록
          setFriendRequests={setFriendRequests} // 친구 요청 목록을 업데이트하는 함수
        />
      ))}
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({});
