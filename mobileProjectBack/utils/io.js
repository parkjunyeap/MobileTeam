module.exports = function (io) {
    io.on("connection", async (socket) => {
        console.log("Client is connected", socket.id)
        
        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id)
        })
    })
}