// LogIn.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const LogIn = ({ onLoginSuccess }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      {/* 여기에서 onLoginSuccess 함수를 호출합니다. */}
      <Button title="로그인" onPress={onLoginSuccess} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default LogIn;
