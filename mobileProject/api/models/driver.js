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
  carNumber: {
    type: String,
    required: true,
  },
  carName: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
  },

  // 택시 운행 상태
  driveState: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Driver = mongoose.model("Driver", driverSchema); // 'User' 모델로 스키마 컴파일

module.exports = Driver; // 모듈로 내보내기, 다른 파일에서 사용 가능
