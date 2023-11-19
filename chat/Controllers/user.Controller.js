const userController = {}
const User = require("../Models/user")

userController.saveUser = async (userName, sid) => {
    let user = await User.findOne({ name: userName })
    if (!user) {
        user = new User({
            name: userName,
            token: sid,
            online: true,
        })
    }
    user.token = sid
    user.online = true

    await user.save()
    return user
}

userController.checkUser = async (sid) => {
    const user = await User.findOne({ "token": sid });
    if (!user) { new Error("user not found") }    //유저가 없으면?
    
    return user;
}
module.exports = userController
