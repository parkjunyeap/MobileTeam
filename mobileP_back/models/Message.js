const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,
  sender: String,    // 발신자 ID
  receiver: String,  // 수신자 ID
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);
