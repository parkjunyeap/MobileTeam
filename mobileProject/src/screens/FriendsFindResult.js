import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import User from "../components/User";

const FriendFindResult = () => {
  const route = useRoute();
  const { userPCs, userSEs } = route.params || {};

  // 중복 제거 로직: 사용자의 _id를 기반으로 중복 제거
  const uniqueUserIds = new Set();
  const combinedUsers = [...userPCs, ...userSEs].filter(user => {
    if (!uniqueUserIds.has(user._id)) {
      uniqueUserIds.add(user._id);
      return true;
    }
    return false;
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
