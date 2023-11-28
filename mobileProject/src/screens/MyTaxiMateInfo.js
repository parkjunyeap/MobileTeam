import React, { useState } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MAP_KEY } from "../../env";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const locationData = {
  경기도: ["수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "안양시", "남양주시", "화성시", "평택시", "의정부시", "시흥시", "파주시", "광명시", "김포시", "군포시", "광주시", "이천시", "양주시", "오산시", "구리시", "안성시", "포천시", "의왕시", "하남시", "여주시", "양평군", "동두천시", "과천시", "가평군", "연천군"],
  강원도: ["춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"],
  충청북도: ["청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"],
  충청남도: ["천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시", "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군"],
  전라북도: ["전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군"],
  전라남도: ["목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"],
  경상북도: ["포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시", "문경시", "경산시", "군위군", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군"],
  경상남도: ["창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시", "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군", "거창군", "합천군"],
  제주특별자치도: ["제주시", "서귀포시"],
  서울특별시: ["종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구", "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구", "양천구", "강서구", "구로구", "금천구", "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구"],
  부산광역시: ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "해운대구", "사하구", "금정구", "강서구", "연제구", "수영구", "사상구", "기장군"],
  대구광역시: ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군"],
  인천광역시: ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
  광주광역시: ["동구", "서구", "남구", "북구", "광산구"],
  대전광역시: ["동구", "중구", "서구", "유성구", "대덕구"],
  울산광역시: ["중구", "남구", "동구", "북구", "울주군"],
  세종특별자치시: ["조치원읍", "연기면", "연동면", "부강면", "금남면", "장군면", "연서면", "전의면", "전동면", "소정면", "한솔동", "새롬동", "도담동", "아름동", "종촌동", "고운동", "소담동", "보람동", "대평동"],
};

const MyTaxiMateInfo = () => {
  const [selectedProvince, setSelectedProvince] = useState(Object.keys(locationData)[0]);
  const [selectedCity, setSelectedCity] = useState(locationData[Object.keys(locationData)[0]][0]);
  const [favoriteStartLocation, setFavoriteStartLocation] = useState("");
  const [favoriteEndLocation, setFavoriteEndLocation] = useState("");
  const [favoriteTime1, setFavoriteTime1] = useState({ hour: "01", minute: "00" });
  const [favoriteTime2, setFavoriteTime2] = useState({ hour: "01", minute: "00" });


  // 새로운 상태 추가: 날짜 피커를 표시할지 여부
  const [showTimePicker1, setShowTimePicker1] = useState(false);
  const [showTimePicker2, setShowTimePicker2] = useState(false);


  // 시간과 분을 위한 상태 추가
  const [selectedHour1, setSelectedHour1] = useState('01');
  const [selectedMinute1, setSelectedMinute1] = useState('00');
  const [selectedHour2, setSelectedHour2] = useState('01');
  const [selectedMinute2, setSelectedMinute2] = useState('00');

  const onProvinceChange = (province) => {
    setSelectedProvince(province);
    const citiesForProvince = locationData[province];
    setSelectedCity(citiesForProvince[0]);
  };

  // useState 로 관리하는거 즐겨타는 출발지 , 목적지 , 시간 도 해야되는데,,



  const handleStartLocationChange = (value) => {
    setFavoriteStartLocation(value);
  };

  const handleEndLocationChange = (value) => {
    setFavoriteEndLocation(value);
  };

  const handleTime1Change = (value) => {
    setFavoriteTime1(value);
  };

  const handleTime2Change = (value) => {
    setFavoriteTime2(value);
  };

  const handleReviewButtonClick = () => {
    // 리뷰 보기 버튼 클릭 시 실행할 코드 작성
  };

  // Picker를 사용하여 시간과 분을 설정하는 핸들러 함수
  const handleHourChange1 = (itemValue) => {
    setSelectedHour1(itemValue);
    setFavoriteTime1({ ...favoriteTime1, hour: itemValue });
  };
  
  const handleMinuteChange1 = (itemValue) => {
    setSelectedMinute1(itemValue);
    setFavoriteTime1({ ...favoriteTime1, minute: itemValue });
  };

  const handleHourChange2 = (itemValue) => {
    setSelectedHour2(itemValue);
    setFavoriteTime2({ ...favoriteTime2, hour: itemValue });
  };
  
  const handleMinuteChange2 = (itemValue) => {
    setSelectedMinute2(itemValue);
    setFavoriteTime2({ ...favoriteTime2, minute: itemValue });
  };


  const navigation = useNavigation(); // 네비게이션 객체 가져오기

  const handleSaveButtonClick = () => {
    console.log("선택한 도:", selectedProvince);
    console.log("선택한 시:", selectedCity);
    console.log("즐겨타는 출발지:", favoriteStartLocation);
    console.log("즐겨타는 목적지:", favoriteEndLocation);
    console.log(
      "즐겨타는 시간대 1:",
      favoriteTime1.hour + ":" + favoriteTime1.minute
    );
    console.log(
      "즐겨타는 시간대 2:",
      favoriteTime2.hour + ":" + favoriteTime2.minute
    );

    // 이 정보들을 서버로 전송하거나 다른 작업을 수행할 수 있습니다.
    navigation.goBack();
  };

   // TimePicker 핸들러
   const onTimeChange1 = (event, selectedTime) => {
    setShowTimePicker1(false); // 피커 숨기기
    const currentTime = selectedTime || favoriteTime1;
    setFavoriteTime1({ hour: currentTime.getHours(), minute: currentTime.getMinutes() });
  };

  const onTimeChange2 = (event, selectedTime) => {
    setShowTimePicker2(false); // 피커 숨기기
    const currentTime = selectedTime || favoriteTime2;
    setFavoriteTime2({ hour: currentTime.getHours(), minute: currentTime.getMinutes() });
  };

  return (
    <View style={styles.container}>
      <Text> 택시를 이용하는 지역</Text>
      <Text>도 : {selectedProvince}</Text>
      <Picker
        selectedValue={selectedProvince}
        onValueChange={(itemValue) => onProvinceChange(itemValue)}
        style={styles.picker}
      >
        {Object.keys(locationData).map((province) => (
          <Picker.Item key={province} label={province} value={province} />
        ))}
      </Picker>

      <Text>시 : {selectedCity}</Text>
      <Picker
        selectedValue={selectedCity}
        onValueChange={(itemValue) => setSelectedCity(itemValue)}
        style={styles.picker}
      >
        {locationData[selectedProvince].map((city) => (
          <Picker.Item key={city} label={city} value={city} />
        ))}
      </Picker>

      <Text> 즐겨타는 목적지 : </Text>
      <View style={styles.location}>
        <GooglePlacesAutocomplete
          placeholder="자주타는 목적지를 적어주세요!"
          styles={{
            container: { flex: 0 },
            textInput: { paddingLeft: 20, height: 40 },
          }}
          onPress={(data) => handleEndLocationChange(data.description)}
          onFail={(e) => {
            console.log("GooglePlacesAutocomplete onFail : ", e);
          }}
          query={{ key: MAP_KEY, language: "ko", components: "country:kr" }}
          debounce={400}
        />
        <View style={styles.locationIcon}>
          <MaterialCommunityIcons name="map-marker" size={20} />
        </View>
      </View>

      <Text> 즐겨타는 목적지 : </Text>
      <View style={styles.location}>
        <GooglePlacesAutocomplete
          placeholder="자주타는 목적지를 적어주세요!"
          styles={{
            container: { flex: 0 },
            textInput: { paddingLeft: 20, height: 40 },
          }}
          onPress={(data) => handleEndLocationChange(data.description)}
          onFail={(e) => {
            console.log("GooglePlacesAutocomplete onFail : ", e);
          }}
          query={{ key: MAP_KEY, language: "ko", components: "country:kr" }}
          debounce={400}
        />
        <View style={styles.locationIcon}>
          <MaterialCommunityIcons name="map-marker" size={20} />
        </View>
      </View>
      <Text> 즐겨타는 시간대 1</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Picker
          selectedValue={selectedHour1}
          style={{ width: 100 }}
          onValueChange={(itemValue) => handleHourChange1(itemValue)}>
          {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map((hour) => (
            <Picker.Item key={hour} label={hour} value={hour} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedMinute1}
          style={{ width: 100 }}
          onValueChange={(itemValue) => handleMinuteChange1(itemValue)}>
          {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((minute) => (
            <Picker.Item key={minute} label={minute} value={minute} />
          ))}
        </Picker>
      </View>

      <Text> 즐겨타는 시간대 2</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Picker
          selectedValue={selectedHour2}
          style={{ width: 100 }}
          onValueChange={(itemValue) => handleHourChange2(itemValue)}>
          {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map((hour) => (
            <Picker.Item key={hour} label={hour} value={hour} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedMinute2}
          style={{ width: 100 }}
          onValueChange={(itemValue) => handleMinuteChange2(itemValue)}>
          {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((minute) => (
            <Picker.Item key={minute} label={minute} value={minute} />
          ))}
        </Picker>
      </View>


      {/* 버튼 style 먹이느라 */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="초기화"
            onPress={handleReviewButtonClick}
            color="#28a745"
          />
        </View>
        <View style={{ width: 20 }} />
        <View style={styles.buttonWrapper}>
          <Button
            title="검색"
            onPress={handleSaveButtonClick}
            color="#28a745"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  picker: {
    height: 50,
    width: 250,
    marginBottom: 20, // Picker들 사이의 간격을 조정
  },

  location: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    // borderBottomColor : GRAY.LIGHT,
  },
  locationIcon: {
    position: "absolute",
    left: 20,
    top: 16,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  buttonWrapper: {
    flex: 1, // each button will take half of the container width
    borderRadius: 5, // slight roundness to the corners
    overflow: "hidden", // ensures the borderRadius is respected
  },
});

export default MyTaxiMateInfo;
