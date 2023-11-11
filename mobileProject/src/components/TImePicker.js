// import React, { useState } from "react";
// import { View, Button, Platform } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";

// const TimePicker = () => {
//   const [date, setDate] = useState(new Date());
//   const [mode, setMode] = useState("time");
//   const [show, setShow] = useState(false);

//   const onChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShow(Platform.OS === "ios");
//     setDate(currentDate);
//   };

//   const showMode = (currentMode) => {
//     setShow(true);
//     setMode(currentMode);
//   };

//   const showTimepicker = () => {
//     showMode("time");
//   };

//   return (
//     <View>
//       <View>
//         <Button onPress={showTimepicker} title="시간 선택" />
//       </View>
//       {show && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           value={date}
//           mode={mode}
//           is24Hour={true}
//           display="default"
//           onChange={onChange}
//         />
//       )}
//     </View>
//   );
// };

// export default TimePicker;

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const TimePicker = () => {
  const [selectedHour, setSelectedHour] = useState("01");
  const [selectedMinute, setSelectedMinute] = useState("00");

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
        onValueChange={(itemValue, itemIndex) => setSelectedHour(itemValue)}
        style={styles.picker}
      >
        {hours.map((hour, index) => (
          <Picker.Item label={hour} value={hour} key={index} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedMinute}
        onValueChange={(itemValue, itemIndex) => setSelectedMinute(itemValue)}
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
