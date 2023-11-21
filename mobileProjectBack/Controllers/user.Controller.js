const User = require("../Models/user"); // User 모델을 불러옵니다.

const userController = {};

userController.saveUser = async (userData) => {
    // 사용자 데이터로 새 User 인스턴스 생성 또는 업데이트
    let user = await User.findOne({ uid: userData.uid });
    if (!user) {
        user = new User(userData);
    } else {
        // 필요한 경우 기존 데이터 업데이트
    }
    await user.save();
    return user;
};

userController.findUserByUid = async (uid) => {
    const user = await User.findOne({ uid: uid });
    if (!user) { new Error("user not found") }  
    return user;
};

module.exports = userController;
