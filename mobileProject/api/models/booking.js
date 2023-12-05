const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  // 날짜 입력 (피커이용)
  // 시간 탑승
  // 출발지
  // 목적지
  // 유저아이디  --   // 유저이름
  // 드라이버아이디  -- //   드라이버이름?
  bookingDate: {
    type: String,
    required: true, // 날짜 입력 (피커이용)
    // 시간 탑승
  },

  bookingTime: {
    type: String,
    required: true, // 시간 입력
    // 시간 탑승
  },

  boarderId: {
    type: mongoose.Schema.Types.ObjectId, // 유저아이디
    ref: "User",
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId, // 택시기사아이디
    ref: "Driver",
  }, //
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
});

const Booking = mongoose.model("Booking", bookingSchema); // 'User' 모델로 스키마 컴파일

module.exports = Booking; // 모듈로 내보내기, 다른 파일에서 사용 가능
