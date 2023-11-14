
module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('A user connected');
  
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
  
      // Handling chat message event
      socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        // Emit the message to all clients
        io.emit('chat message', msg);
      });
    });
  };