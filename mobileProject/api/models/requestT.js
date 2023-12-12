const mongoose = require("mongoose");

// sender ID , receiver Id 등 저렇게 써도될까?
const requestTSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // 사용자를 참조하는 ID
        ref: "User",
    },
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
        type: Date, // 요청 수락 날짜
        default: Date.now,
    },
    pay: {
        // 결제금액
        type: String,
        require: false,
      },
    distance:{
        type:String,
        require:false
    }
});
const Request = mongoose.model("requestT", requestTSchema); // 'Driver' 모델로 스키마 컴파일

module.exports = Request;
//
