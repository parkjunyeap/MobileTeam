const mongoose = require('mongoose');

const infosetSchema = new mongoose.Schema({
  region: {
    type: String,
    required: true
  },
  favoriteStartPoint: {
    type: String,
    required: true
  },
  favoriteEndPoint: {
    type: String,
    required: true
  },
  favoriteTimeFrame1: {
    type: String, // "HH:mm" 형식으로 저장, 예: '09:00'
    required: true
  },
  favoriteTimeFrame2: {
    type: String, // "HH:mm" 형식으로 저장, 예: '18:00'
    required: true
  }
});

module.exports = mongoose.model("InfoSet", infosetSchema);