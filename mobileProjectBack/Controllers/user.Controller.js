const User = require("../Models/user"); // User 모델을 불러옵니다.

const userController = {};

userController.saveUser = async ( userUid, userdisplayName, userphotoURL, sid ) => {
    // 사용자 데이터로 새 User 인스턴스 생성 또는 업데이트
    try {
        let user = await User.findOne({ uid: userUid });
        if (!user) {
            user = new User({
                uid: userUid,
                displayName: userdisplayName,
                photoURL: userphotoURL,
                token: sid
            });
        } else {
            user.token = sid;
        }
        await user.save();
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

userController.findUserByUid = async (uid) => {
    const user = await User.findOne({ uid: uid });
    if (!user) { throw new Error("user not found") }
    return user;
};

module.exports = userController;
