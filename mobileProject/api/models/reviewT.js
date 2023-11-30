const mongoose = require("mongoose");

// sender ID , receiver Id 등 저렇게 써도될까?
const reviewTSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId, // 택시 기사를 참조하는 ID
    ref: "User",
  }, // 리뷰를 보여줄때는 .name 만 불러오면됨.
  receiverId: {
    type: mongoose.Schema.Types.ObjectId, // 택시 기사를 참조하는 ID
    ref: "Driver",
  }, //
  rating: {
    type: Number, // 평점 (예: 1에서 5까지)
    required: true,
  },
  comment: {
    type: String, // 리뷰 내용
    required: false,
  },
  reviewDate: {
    type: Date, // 리뷰 작성 날짜
    default: Date.now,
  },
});

const ReviewT = mongoose.model("ReviewT", reviewTSchema); // 'Review' 모델로 스키마 컴파일

module.exports = ReviewT; // 모듈로 내보내기, 다른 파일에서 사용 가능
