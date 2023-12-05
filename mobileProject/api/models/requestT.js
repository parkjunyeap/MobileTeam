const mongoose = require("mongoose");

// sender ID , receiver Id 등 저렇게 써도될까?
const requestTSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // 택시 기사를 참조하는 ID
        ref: "User",
    }, // 리뷰를 보여줄때는 .name 만 불러오면됨.
    driverId: {
        type: mongoose.Schema.Types.ObjectId, // 택시 기사를 참조하는 ID
        ref: "Driver",
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
    requestDate: {
        type: Date, // 리뷰 작성 날짜
        default: Date.now,
    },
});
const Request = mongoose.model("requestT", requestTSchema); // 'Driver' 모델로 스키마 컴파일

module.exports = Request;
//
