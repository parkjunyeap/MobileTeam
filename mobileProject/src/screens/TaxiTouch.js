import { StyleSheet, Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const TaxiTouch = () => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
      >
        {/* 여기서 지도 관련 컨텐츠를 추가할 수 있습니다. */}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: 300, // 원하는 너비 설정
    height: 300, // 원하는 높이 설정
  },
});

export default TaxiTouch;
