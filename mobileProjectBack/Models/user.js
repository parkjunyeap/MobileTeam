const mongoose = require("mongoose")
const friendSchema = require('./friend');
const infosetSchema = require('./infoset');

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
    infoSetting: [infosetSchema]
    // ... 기타 필드
});
module.exports = mongoose.model("User", userSchema)