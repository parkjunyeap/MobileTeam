import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

const PayMentScreen = () => {
  // 버튼 이벤트 핸들러
  const handleShare = () => {
    console.log('공유하기 버튼 클릭');
  };

  const handleSave = () => {
    console.log('저장하기 버튼 클릭');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>결제 내역</Text>
      </View>
      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>예약 일정 선택</Text>
          <Text style={styles.infoContent}>23.08.12</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>출발 정보</Text>
          <Text style={styles.infoContent}>스위치마을</Text>
        </View>
        {/* ... 다른 정보 필드 ... */}
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>결제 방법</Text>
          <Text style={styles.infoContent}>신용카드</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>요금 정보</Text>
          <Text style={styles.infoContent}>59000원</Text>
        </View>
        
      </View>
      <View style={styles.buttonContainer}>
        <Button title="공유하기" onPress={handleShare} color="#4CAF50" />
        <Button title="저장하기" onPress={handleSave} color="#4CAF50" />
      </View>
      {/* ... 탭 네비게이션 컴포넌트(여기에 구현 또는 임포트) ... */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  // ... 다른 스타일링이 필요한 경우 여기에 추가 ...
});

export default PayMentScreen;
