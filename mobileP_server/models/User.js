const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  photoURL: {
    type: String
  },
  // 기타 필요한 사용자 정보 필드
});

const User = mongoose.model('User', userSchema);

module.exports = User;
