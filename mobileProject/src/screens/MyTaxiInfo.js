import { StyleSheet, Text, View } from "react-native";

const MyTaxiInfo = () => {
  return (
    <View style={styles.container}>
      <Text>MyTaxiInfo</Text>
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

export default MyTaxiInfo;
