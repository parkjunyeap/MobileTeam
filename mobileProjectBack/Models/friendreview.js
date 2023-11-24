const mongoose = require('mongoose');

const friendreviewSchema = new mongoose.Schema({
    friendId: {
        type: mongoose.Schema.Types.ObjectId, // 친구를 참조하는 ID
        ref: 'User',
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
});

module.exports = friendreviewSchema;
