const chatController = require("../Controllers/chat.Controller")
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

        socket.on("sendMessage", async (message, cb) => {
            try { 
                const user = await userController.checkUser(socket.id)
                //메세지 보내기
                const newMessage = await chatController.saveChat(message, user)
            
                io.emit("messgage", newMessage)
                cb({ ok: true,newMessage: newMessage})
            } catch (error) {
                cb({ ok: false, error: error.message })
            }
        })
    })
}