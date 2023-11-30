import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CertificationScreen = ({ onCertificationScreenSuccess }) => {
  const [image, setImage] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true, // Base64 인코딩 활성화
    });
  
    if (!result.cancelled) {
      // result.base64에 Base64 인코딩된 이미지 데이터가 저장됩니다.
      setImage(result.base64);
    }
  };

  const submitCertification = () => {
    // 자격증 정보 제출 로직 구현 (실제 구현 내용은 여기에 추가)
    // 네비게이션: 'BottomTabNavigator' 내의 'TaxiTouch' 스크린으로 이동
    navigation.navigate('BottomTabNavigator', {
      screen: '정보', // MyInfoStackNavigator에 해당하는 탭 이름
      params: {
        screen: 'DriverInfo', 
        params: {
          image: image,
          licenseNumber: licenseNumber,
          name: name,
          birthDate: birthDate,
          expirationDate: expirationDate
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>자격증 등록</Text>

      <View style={styles.imagePickerContainer}>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>자격증 사진 등록</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="자격증 번호 입력"
        value={licenseNumber}
        onChangeText={setLicenseNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="이름 입력"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="생년월일 입력"
        value={birthDate}
        onChangeText={setBirthDate}
      />
      <TextInput
        style={styles.input}
        placeholder="유효 기간 입력"
        value={expirationDate}
        onChangeText={setExpirationDate}
      />

      <Button title="제출" onPress={onCertificationScreenSuccess} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imagePickerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  placeholderContainer: {
    width: 150,
    height: 150,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    color: '#a1a1a1',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  }
});

export default CertificationScreen;