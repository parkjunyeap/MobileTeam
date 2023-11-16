import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const TimePicker = ({
  selectedHour,
  selectedMinute,
  onHourChange,
  onMinuteChange,
}) => {
  // 1시부터 24시까지의 시간 배열을 생성합니다.
  const hours = Array.from({ length: 24 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  // 0분부터 59분까지의 분 배열을 생성합니다.
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedHour}
        onValueChange={(itemValue) => onHourChange(itemValue)}
        style={styles.picker}
      >
        {hours.map((hour, index) => (
          <Picker.Item label={hour} value={hour} key={index} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedMinute}
        onValueChange={(itemValue) => onMinuteChange(itemValue)}
        style={styles.picker}
      >
        {minutes.map((minute, index) => (
          <Picker.Item label={minute} value={minute} key={index} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    width: 100,
  },
});

export default TimePicker;
