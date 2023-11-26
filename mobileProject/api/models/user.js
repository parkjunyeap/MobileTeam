const mongoose = require("mongoose");

// MongoDB 사용자 스키마 정의
const userSchema = new mongoose.Schema({
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
  freindRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 다른 사용자 문서를 참조하는 친구 요청 수신 목록
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 사용자의 친구 목록, 다른 'User' 문서들을 참조
    },
  ],
  sentFriendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 보낸 친구 요청 목록, 다른 'User' 문서들을 참조
    },
  ],
});

const User = mongoose.model("User", userSchema); // 'User' 모델로 스키마 컴파일

module.exports = User; // 모듈로 내보내기, 다른 파일에서 사용 가능
