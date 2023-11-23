import React from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const paymentData = [
  {
    key: "1",
    articleName: "차무식",
    date: "2023-01-01",
    departure: "선문대",
    arrival: "우리집",
  },
  {
    key: "2",
    articleName: "무식차",
    date: "2023-02-02",
    departure: "우리집",
    arrival: "선문대",
  },
  // ... other articles
];

const PaymentList = ({ navigation }) => {
  const goToPaymentDetail = (item) => {
    // Pass the entire item or just specific properties to the PaymentDetail screen
    navigation.navigate("PaymentDetail", { ...item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => goToPaymentDetail(item)}
      style={styles.itemTouchable}
    >
      <View style={styles.itemContainer}>
        <View style={styles.articleContainer}>
          <Text style={styles.articleName}>{item.articleName}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <Text style={styles.details}>
          {item.departure} to {item.arrival}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const itemSeparator = () => <View style={styles.separator} />;

  return (
    <FlatList
      data={paymentData}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      ItemSeparatorComponent={itemSeparator} // 이거 그냥 수평선
    />
  );
};

const styles = StyleSheet.create({
  itemTouchable: {
    backgroundColor: "white",
  },
  itemContainer: {
    flexDirection: "column",
    padding: 10,
  },
  articleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  articleName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 16,
  },
  details: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: "#737373",
    alignSelf: "stretch",
  },
});

export default PaymentList;
