const userController = require("../Controllers/user.Controller")

module.exports = function (io) {
    io.on("connection", async (socket) => {
        console.log("Client is connected", socket.id)

        socket.on("login", async (userData, cb) => { // token 추가
            try {
                const user = await userController.saveUser (userData.uid, userData.displayName, userData.photoURL, socket.id);
                console.log(user)
                cb({ ok: true, data: user });
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });

        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id)
        })
    })
}