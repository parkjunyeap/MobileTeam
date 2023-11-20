const mongoose = require('mongoose');

const taxireviewSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId, // 택시 기사를 참조하는 ID
        required: true
    },
    rating: {
        type: Number, // 평점 (예: 1에서 5까지)
        required: true
    },
    comment: {
        type: String, // 리뷰 내용
        required: false
    },
    reviewDate: {
        type: Date, // 리뷰 작성 날짜
        default: Date.now
    }
    // 필요한 경우 추가적인 필드를 포함할 수 있습니다.
});

module.exports = mongoose.model("TaxiReview", taxireviewSchema)