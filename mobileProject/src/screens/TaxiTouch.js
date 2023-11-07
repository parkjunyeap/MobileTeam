import { StyleSheet, Text, View } from "react-native";

const TaxiTouch = () => {
  return (
    <View style={styles.container}>
      <Text>택시잡기</Text>
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

export default TaxiTouch;
