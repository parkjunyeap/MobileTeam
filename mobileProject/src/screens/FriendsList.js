// FriendsList.js
import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

const FriendsList = ({ route }) => {
  // 'FriendsList' 대신 'friendsList'를 사용하여 구조 분해 할당합니다.
  const { friendsList } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        data={friendsList} // 여기도 'FriendsList' 대신 'friendsList'를 사용합니다.
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.name}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default FriendsList;
