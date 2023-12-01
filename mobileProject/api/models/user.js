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
    default:
      "https://e7.pngegg.com/pngimages/981/645/png-clipart-default-profile-united-states-computer-icons-desktop-free-high-quality-person-icon-miscellaneous-silhouette.png",
    required: true, // 사용자 프로필 이미지, 필수 입력 필드
  },

  // 이거그냥 기본이미지로 해볼려함.
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

  // 다 스트링으로 해도되나...?
  // 일단 검색을 지역만으로 검색하게했음,,
  // 출발지 , 목적지를 어떤 조건으로 검색하게 할지 못정하겠음. 어려움.

  // 내 정보의

  // 결제내역
  // payment: [
  //   {
  //     // 탑승자유저 ID 추가 하면 리뷰처럼 따로 빼서 관리가능하겠다.
  //     // 이 결제내역을 택시기사도 볼 수 있게 하고싶었으니까. 택시기사도 자기가 운행을 얼마나해서 금액을 얼마나 받았는지 볼 수 있잖아 이렇게하면
  //     boardingDate: {
  //       //탑승일
  //       type: String,
  //       required: false,
  //     },
  //     startPoint: {
  //       // 출발지
  //       type: String,
  //       required: false,
  //     },
  //     endPoint: {
  //       //목적지
  //       type: String,
  //       required: false,
  //     },
  //     carNumber: {
  //       //차량번호   ---> 기사아이디로 대체가능  기사아이디에서 기사이름 참조 , 차량번호 참조
  //       type: String,
  //       required: false,
  //     },
  //     carName: {
  //       // 기사이름 ....> 기사아이디로 대체가능  기사아이디에서 기사이름 참조 , 차량번호 참조
  //       type: String,
  //       require: false,
  //     },
  //     pay: {    // 결제금액
  //       type: String,
  //       require: false,
  //     },
  //   },
  // ],

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
