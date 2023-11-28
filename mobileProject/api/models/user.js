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

  infoSetting:
    // user의 택시친구정보
    {
      province: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      favoriteStartPoint: {
        type: String,
        required: false,
      },
      favoriteEndPoint: {
        type: String,
        required: false,
      },
      favoriteTimeFrame1: {
        hour: {
          type: String,
          required: false,
        },
        minute: {
          type: String,
          required: false,
        },
      },
      favoriteTimeFrame2: {
        hour: {
          type: String,
          required: false,
        },
        minute: {
          type: String,
          required: false,
        },
      },
    },
  // 내 정보의

  // 결제내역
  payment: [
    {
      boardingDate: {
        //탑승일
        type: String,
        required: false,
      },
      startPoint: {
        // 출발지
        type: String,
        required: false,
      },
      endPoint: {
        //목적지
        type: String,
        required: false,
      },
      carNumber: {
        //차량번호
        type: String,
        required: false,
      },
      carName: {
        type: String,
        require: false,
      },
      pay: {
        type: String,
        require: false,
      },
    },
  ],

  // userRivew
  // userReview: [
  //   // 보내는사람, 받는사람 만 있으면된다.
  //   {

  //     // 필요한 경우 추가적인 필드를 포함할 수 있습니다.
  //   },
  // ],

  /*currentLocation: {
    type: {
      type: String, // GeoJSON 타입
      enum: ['Point'], // 'Point' 타입
      required: true,
    },
    coordinates: {
      type: [Number], // [경도, 위도]
      required: true,
    }
  },*/
});

// 위치 정보를 위한 인덱스 생성 (MongoDB의 위치 기반 쿼리를 위해)
//userSchema.index({ currentLocation: '2dsphere' });

const User = mongoose.model("User", userSchema); // 'User' 모델로 스키마 컴파일

module.exports = User; // 모듈로 내보내기, 다른 파일에서 사용 가능
