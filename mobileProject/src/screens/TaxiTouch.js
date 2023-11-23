import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity } from 'react-native';

const TaxiTouch = () => {
  const [isDriving, setIsDriving] = useState(false);

  return (
    <View style={styles.container}>
      {/* 헤더: 운행 텍스트 */}
      <Text style={styles.header}>운행</Text>

      {/* 택시 운행중 스위치와 레이블 */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>택시 운행중</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDriving ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={() => setIsDriving(previousState => !previousState)}
          value={isDriving}
        />
      </View>

      {/* 출발지와 목적지 정보 카드 */}
      {isDriving && (
        <View style={styles.infoCard}>
          <Text style={styles.distance}>6.5KM 11분</Text>
          <Text style={styles.route}>백화점 > 시민공원</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.acceptButton]}>
              <Text style={styles.buttonText}>수락</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.rejectButton]}>
              <Text style={styles.buttonText}>거절</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50, // 상단에 여백 추가
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, // 스위치와의 간격
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  infoCard: {
    width: '90%', // 카드 너비
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  distance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4, // 거리와 경로 사이 간격
  },
  route: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10, // 경로와 버튼 사이 간격
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // 버튼을 카드 너비에 맞춤
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10, // 버튼 사이 간격
  },
  acceptButton: {
    backgroundColor: '#4CAF50', // 수락 버튼 색상
  },
  rejectButton: {
    backgroundColor: '#F44336', // 거절 버튼 색상
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
});

export default TaxiTouch;
