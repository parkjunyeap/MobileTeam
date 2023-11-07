import { StyleSheet, Text, View } from "react-native";

const SearchFriends = () => {
  return (
    <View style={styles.container}>
      <Text>친구검색</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchFriends;
