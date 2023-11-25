const userController = require("../Controllers/user.Controller")

module.exports = function (io) {
    io.on("connection", async (socket) => {
        console.log("Client is connected", socket.id)

        socket.on("login", async (userData, cb) => { // token 추가
            try {
                const user = await userController.saveUser(userData.uid, userData.displayName, userData.photoURL, socket.id);
                console.log(user)
                cb({ ok: true, data: user });
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });

        socket.on("updateinfoSet", async (requestData) => {
            try {
              const uid = requestData.uid;
              const data = requestData.data;
          
              // Infoset 업데이트 로직
              const response = await userController.updateInfo(uid, data);
              
              // 클라이언트에 응답을 전송합니다.
              if (response.success) {
                // Infoset 업데이트가 성공한 경우
                console.log("Infoset 업데이트 성공:", response.data);
                // 클라이언트에서 필요한 작업을 수행하세요.
                socket.emit("updateinfoSetResponse", { success: true, data: response.data });
              } else {
                // Infoset 업데이트가 실패한 경우
                console.error("Infoset 업데이트 실패:", response.error);
                // 오류 처리 로직을 추가하세요.
                socket.emit("updateinfoSetResponse", { success: false, error: response.error });
              }
            } catch (error) {
              console.error("Error updating Infoset:", error);
            }
          });

        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id)
        })
    })
}