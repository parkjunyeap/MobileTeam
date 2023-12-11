import React, { useContext } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import User from "../components/User";
import { UserType } from "../UserContext"; // 예시로 사용자 컨텍스트를 임포트

const FriendFindResult = () => {
  const route = useRoute();
  const { userPCs, userSEs } = route.params || {};
  const { userId: currentUserId } = useContext(UserType); // 현재 로그인한 사용자의 _id

  // 중복 제거 및 현재 사용자 제외 로직
  const uniqueUserIds = new Set();
  const combinedUsers = [...userPCs, ...userSEs].filter(user => {
    return user._id !== currentUserId && !uniqueUserIds.has(user._id) && uniqueUserIds.add(user._id);
  });

  return (
    <View>
      <ScrollView>
        <View style={{ padding: 15 }}>
          {combinedUsers.length > 0 ? (
            combinedUsers.map((user, index) => <User key={index} item={user} />)
          ) : (
            <Text>No users found.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default FriendFindResult;

const styles = StyleSheet.create({});
