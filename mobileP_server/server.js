const http = require('http');
const app = require('./app'); // Express 애플리케이션을 가져옵니다.
const socketio = require('socket.io');

// HTTP 서버를 생성하고 Express 앱을 연결합니다.
const server = http.createServer(app);

// Socket.IO 인스턴스를 생성하고 HTTP 서버에 바인딩합니다.
const io = socketio(server, {
  cors: {
    origin: "http://localhost:27017", // 프로덕션 환경에서는 이 값을 프론트엔드 서비스의 실제 URL로 설정해야 합니다.
    methods: ["GET", "POST"]
  }
});

// Socket.IO 이벤트 핸들러를 설정합니다. (예: 'sockets/socket.js')
require('./sockets/socket')(io);

// 서버를 시작하고 지정된 포트에서 리스닝합니다.
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});