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

userController.updateInfo = async (uid, infoData) => {
    try {
        // 사용자 정보에서 이전 Infoset 데이터를 찾습니다.
        const user = await User.findOne({ uid: uid });
        if (!user) {
            return { success: false, error: "사용자를 찾을 수 없습니다." };
        }

        const existingInfoset = user.infoSetting.find(() => true); // 첫 번째 요소를 찾음

        if (existingInfoset) {
            // 이전 Infoset 데이터가 있는 경우 해당 데이터를 업데이트합니다.
            existingInfoset.province = infoData.selectedProvince;
            existingInfoset.city = infoData.selectedCity;
            existingInfoset.favoriteStartPoint = infoData.favoriteStartLocation;
            existingInfoset.favoriteEndPoint = infoData.favoriteEndLocation;
            existingInfoset.favoriteTimeFrame1 = {
              hour: infoData.favoriteTime1.hour,
              minute: infoData.favoriteTime1.minute
            };
            existingInfoset.favoriteTimeFrame2 = {
              hour: infoData.favoriteTime2.hour,
              minute: infoData.favoriteTime2.minute
            };
        
            // 사용자 정보를 저장합니다. Infoset 데이터가 업데이트됩니다.
            await user.save();
        
            return { success: true, data: existingInfoset };
        } else {
            // 이전 Infoset 데이터가 없는 경우 새로운 Infoset 데이터를 생성합니다.
            const newInfoset = {
              province: infoData.selectedProvince,
              city: infoData.selectedCity,
              favoriteStartPoint: infoData.favoriteStartLocation,
              favoriteEndPoint: infoData.favoriteEndLocation,
              favoriteTimeFrame1: {
                hour: infoData.favoriteTime1.hour,
                minute: infoData.favoriteTime1.minute
              },
              favoriteTimeFrame2: {
                hour: infoData.favoriteTime2.hour,
                minute: infoData.favoriteTime2.minute
              }
            };
        
            // Infoset 데이터를 사용자 정보의 infoSetting 배열에 추가합니다.
            user.infoSetting = [newInfoset];
        
            // 사용자 정보를 저장합니다.
            await user.save();
        
            return { success: true, data: newInfoset };
        }
        
    } catch (error) {
        console.error("Error updating Infoset:", error);
        return { success: false, error: error.message };
    }
};


module.exports = userController;
