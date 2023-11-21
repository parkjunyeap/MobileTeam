const mongoose = require("mongoose")
const friendSchema = require('./friend');
const friendReviewSchema = require('./friendreview'); // 친구 리뷰 스키마
const taxiReviewSchema = require('./taxireview'); // 택시 기사 리뷰 스키마
const infosetSchema = require('./infoset');
const paymentSchema = require('./payment');

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true, // uid는 필수 필드입니다
        unique: true // uid는 고유해야 합니다
    },
    displayName: {
        type: String,
        required: true
    },
    photoURL: {
        type: String,
        required: false
    },
    friends: [friendSchema]
    ,
    friendReviews: [friendReviewSchema] // 친구 리뷰
    ,
    taxiReviews: [taxiReviewSchema] // 택시 기사 리뷰
    , 
    infoSetting: [infosetSchema] // 내 정보 
    , 
    payments: [paymentSchema]   // 결제 내역 목록
    , 
    currentLocation: {
        type: {
          type: String, // GeoJSON 타입
          enum: ['Point'], // 'Point' 타입
          required: true,
        },
        coordinates: {
          type: [Number], // [경도, 위도]
          required: true, 
        }
      },
    // ... 기타 필드
});
// 위치 정보를 위한 인덱스 생성 (MongoDB의 위치 기반 쿼리를 위해)
userSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model("User", userSchema)