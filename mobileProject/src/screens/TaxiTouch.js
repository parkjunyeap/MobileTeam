import { StyleSheet, Text, View } from "react-native";
// import { MapView } from "react-native-maps";
const TaxiTouch = () => {
  return (
    <View style={styles.container}>
      {/* <MapView style={styles.maps} /> */}
      <Text> 택시맵 </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  maps: {
    width: 100,
    height: 100,
  },
});

export default TaxiTouch;
