// const mongoose = require("mongoose");

// const driverSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true, // 사용자 이름, 필수 입력 필드
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true, // 이메일 주소, 중복 불가능하게 유니크 속성 부여
//   },
//   password: {
//     type: String,
//     required: true, // 비밀번호, 필수 입력 필드
//   },
//   image: {
//     type: String,
//     required: true, // 사용자 프로필 이미지, 필수 입력 필드
//   },

//   personalNumber: {
//     type: String,
//     required: true,
//   },
//   carNumber: {
//     type: String,
//     required: true,
//   },
//   driverLicense: {
//     type: String,
//     required: true,
//   },

//   // 택시 운행 상태
//   driveState: {
//     type: Boolean,
//     required: true,
//     default: false,
//   },

//   taxiReview: [
//     {
//       writerId: {
//         type: mongoose.Schema.Types.ObjectId, // 택시 기사를 참조하는 ID
//         ref: "User",
//       }, // 리뷰를 보여줄때는 .name 만 불러오면됨.
//       driverId: {
//         type: mongoose.Schema.Types.ObjectId, // 택시 기사를 참조하는 ID
//         ref: "Driver",
//       }, //
//       rating: {
//         type: Number, // 평점 (예: 1에서 5까지)
//         required: true,
//       },
//       comment: {
//         type: String, // 리뷰 내용
//         required: false,
//       },
//       reviewDate: {
//         type: Date, // 리뷰 작성 날짜
//         default: Date.now,
//       },
//       // 필요한 경우 추가적인 필드를 포함할 수 있습니다.
//     },
//   ],
// });

// const Driver = mongoose.model("driver", driverSchema); // 'User' 모델로 스키마 컴파일

// module.exports = Driver; // 모듈로 내보내기, 다른 파일에서 사용 가능

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

  province: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },

  // 이렇게 추가할게~~

  personalNumber: {
    type: String,
    required: true,
  },
  carNumber: {
    type: String,
    required: true,
  },
  driverLicense: {
    type: String,
    required: true,
  },

  // 택시 운행 상태
  driveState: {
    type: Boolean,
    required: true,
    default: false,
  },

  // taxiReview: [
  //   {
  //     writerId: {
  //       type: mongoose.Schema.Types.ObjectId, // 택시 기사를 참조하는 ID
  //       ref: "User",
  //     }, // 리뷰를 보여줄때는 .name 만 불러오면됨.
  //     driverId: {
  //       type: mongoose.Schema.Types.ObjectId, // 택시 기사를 참조하는 ID
  //       ref: "Driver",
  //     }, //
  //     rating: {
  //       type: Number, // 평점 (예: 1에서 5까지)
  //       required: true,
  //     },
  //     comment: {
  //       type: String, // 리뷰 내용
  //       required: false,
  //     },
  //     reviewDate: {
  //       type: Date, // 리뷰 작성 날짜
  //       default: Date.now,
  //     },
  //     // 필요한 경우 추가적인 필드를 포함할 수 있습니다.
  //   },
  // ],
});

const Driver = mongoose.model("driver", driverSchema); // 'User' 모델로 스키마 컴파일

module.exports = Driver; // 모듈로 내보내기, 다른 파일에서 사용 가능
