const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const server = require('http').createServer(app);
const io = require('socket.io')(server);

//userSchema
const User = require('./models/User');

server.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`));


app.get('/', (req, res) => {
    res.send(`Hello World!`);
});

const mongoose = require('mongoose');

//환경변수
require('dotenv').config();

//db연결
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//메세지
io.on('connection', socket => {
    socket.on('chat message', (msg, receiverId) => {
        const message = new Message({
            content: msg,
            sender: socket.id, // 혹은 인증된 사용자의 ID
            receiver: receiverId
        });
        message.save();
    });
});
//