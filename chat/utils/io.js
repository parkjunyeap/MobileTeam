const userController = require("../Controllers/user.Controller")

module.exports = function (io) {
    io.on("connection", async (socket) => {
        console.log("Client is connected", socket.id)

        socket.on("login", async (userName, cb) => {
            //유저 정보 저장
            try {
                const user = await userController.saveUser(userName, socket.id)
                cb({ ok: true, data: user })
            } catch (error) {
                cb({ ok: false, error: error.message })
            }
        })

        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id)
        })
    })
}