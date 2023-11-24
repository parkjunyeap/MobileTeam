const mongoose = require('mongoose');

const infosetSchema = new mongoose.Schema({
  province: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  favoriteStartPoint: {
    type: String,
    required: false
  },
  favoriteEndPoint: {
    type: String,
    required: false
  },
  favoriteTimeFrame1: {
    type: String, // "HH:mm" 형식으로 저장, 예: '09:00'
    required: false
  },
  favoriteTimeFrame2: {
    type: String, // "HH:mm" 형식으로 저장, 예: '18:00'
    required: false
  }
});

module.exports = infosetSchema