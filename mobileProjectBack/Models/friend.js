const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: false // 친구의 이름 (선택적)
    },
    // 추가적인 정보가 필요하다면 여기에 포함
});

module.exports = mongoose.model("Friend", friendSchema)
