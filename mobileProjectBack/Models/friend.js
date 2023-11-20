const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  memo: {
    type: String,
    required: false
  }
  // 추가적인 정보가 필요하다면 여기에 포함
});

module.exports = mongoose.model("Friend", friendSchema)
