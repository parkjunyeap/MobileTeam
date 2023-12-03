const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // 사용자 이름, 필수 입력 필드
  },
  email: {
    type: String,
    required: true,
    unique: true, // 이메일 주소, 중복 불가능하게 유니크 속성 부여
  },
  password: {
    type: String,
    required: true, // 비밀번호, 필수 입력 필드
  },
  image: {
    type: String,
    required: true, // 사용자 프로필 이미지, 필수 입력 필드
  },
  imaget: {
    type: String, // 택시 드라이버 자격증 업로드?
    required: true,
  },
  carNumber: {
    // 차량번호
    type: String,
    required: true,
  },
  carName: {
    // 차이름 k5
    type: String,
    required: true,
  },
  licenseNumber: {
    //자격증 번호
    type: String,
    required: true,
  },
  getDate: {
    // 습득날짜
    type: String,
    required: true,
  },

  driveState: {
    // 택시 운행 상태
    type: Boolean,
    required: true,
    default: false,
  },

  birthdate: {
    // 생년월일.
    type: Date,
    required: false, // 나중에 true로 바꿔 지금은 오류날수도있어서 이리함
  },

  province: {
    // 도
    type: String,
    required: false,
  },

  city: {
    //시
    type: String,
    required: false,
  },
});

const Driver = mongoose.model("Driver", driverSchema); // 'User' 모델로 스키마 컴파일
const Driver = mongoose.model("Driver", driverSchema); // 'User' 모델로 스키마 컴파일

module.exports = Driver; // 모듈로 내보내기, 다른 파일에서 사용 가능
