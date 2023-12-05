// // 아직 안했는데 할 수 도있음.

// import React from "react";
// import { View, Text, StyleSheet, ScrollView } from "react-native";

// const PaymentDetail = ({ route }) => {
//   // route.params에 모든 데이터가 포함되어 있음
//   const { articleName, date, departure, arrival } = route.params;

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>택시기사이름:</Text>
//         <Text style={styles.value}>{articleName}</Text>
//       </View>
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>날짜:</Text>
//         <Text style={styles.value}>{date}</Text>
//       </View>
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>출발지:</Text>
//         <Text style={styles.value}>{departure}</Text>
//       </View>
//       <View style={styles.detailContainer}>
//         <Text style={styles.label}>목적지:</Text>
//         <Text style={styles.value}>{arrival}</Text>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   detailContainer: {
//     flexDirection: "row",
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
//   label: {
//     fontWeight: "bold",
//     marginRight: 10,
//   },
//   value: {
//     flex: 1, // Take up all available space
//   },
// });

// export default PaymentDetail;
