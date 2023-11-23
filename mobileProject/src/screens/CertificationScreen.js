// CertificationScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const CertificationScreen = ({ navigation }) => {
  const [certification, setCertification] = useState('');

  const submitCertification = () => {
    // 여기에 자격증 정보 제출 로직 구현
    console.log(certification);
    // 제출 후 다음 페이지로 네비게이션 할 수 있습니다.
    // 예: navigation.navigate('NextScreenName');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="자격증 이름을 입력하세요"
        value={certification}
        onChangeText={setCertification}
      />
      <Button title="제출" onPress={submitCertification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10
  }
});

export default CertificationScreen;
