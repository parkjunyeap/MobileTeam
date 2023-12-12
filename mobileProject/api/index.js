const express = require("express"); // Express 모듈을 가져옵니다. Express는 Node.js의 웹 애플리케이션 프레임워크입니다.
const bodyParser = require("body-parser"); // bodyParser 모듈을 가져옵니다. 요청의 본문을 파싱하는 데 사용됩니다.
const mongoose = require("mongoose"); // mongoose 모듈을 가져옵니다. MongoDB를 위한 ODM(Object Data Modeling) 라이브러리입니다.
const passport = require("passport"); // passport 모듈을 가져옵니다. 인증을 위한 미들웨어입니다.
const LocalStrategy = require("passport-local").Strategy; // passport-local 모듈에서 Strategy를 가져옵니다. 이는 로컬 인증 전략을 구현할 때 사용됩니다.

const app = express(); // express 함수를 호출하여 앱 인스턴스를 생성합니다.
const port = 8000; // 서버가 리스닝할 포트 번호를 정의합니다.
const cors = require("cors"); // cors 모듈을 가져옵니다. Cross-Origin Resource Sharing(CORS)를 위한 미들웨어입니다.
app.use(cors()); // 앱에 cors를 미들웨어로 사용하도록 설정합니다. 이를 통해 다른 도메인의 프론트엔드 애플리케이션이 API에 접근할 수 있게 됩니다.

app.use(bodyParser.urlencoded({ extended: false })); // URL 인코딩된 데이터를 파싱하는 bodyParser 미들웨어를 사용하도록 설정합니다.
app.use(bodyParser.json()); // JSON 데이터를 파싱하는 bodyParser 미들웨어를 사용하도록 설정합니다.
app.use(passport.initialize()); // 앱에 passport 미들웨어를 초기화하여 사용하도록 설정합니다.
const jwt = require("jsonwebtoken"); // jsonwebtoken 모듈을 가져옵니다. JWT(JSON Web Tokens)를 생성하고 검증하는 데 사용됩니다.

const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:19006", // 허용할 출처를 여기에 설정
    methods: ["GET", "POST"], // 허용할 HTTP 메서드
  },
});

mongoose
  .connect("mongodb+srv://bab0234:bab0234@cluster0.gp66aaf.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // try 는 아니고 그냥 잘 됐으면 나오는 메시지
    console.log("몽고디비에 연결됨.");
  })
  .catch((err) => {
    console.log("디비에연결 에러 ", err);
  });

app.listen(port, () => {
  console.log("서버런닝 포트 8000번으로");
});

const User = require("./models/user");
const Message = require("./models/message");
const Driver = require("./models/driver");
const Request = require("./models/requestT");

const loginRoutes = require("./logicRoute/LoginLogic")
app.use('/',loginRoutes)
const registRoutes = require("./logicRoute/RegistLogic")
app.use('/',registRoutes)
const friendRequestRoutes = require("./logicRoute/FriendRequestLogic")
app.use('/', friendRequestRoutes)
const infoRoutes = require("./logicRoute/InfoLogic")
app.use('/', infoRoutes)
const driverLocationRoutes = require("./logicRoute/DriverLocationLogic")
app.use('/', driverLocationRoutes)
const paymentRoutes = require('./logicRoute/PaymentLogic')
app.use('/', paymentRoutes)
const reviewRoutes = require('./logicRoute/ReviewLogic');
app.use('/', reviewRoutes)
const bookingRoutes = require('./logicRoute/BookingLogic');
app.use('/', bookingRoutes)

// 자신을 제외한 전체 탑승자 목록 불러옴
app.get("/users/:userId", (req, res) => {
  const loggedInUserId = req.params.userId;
  // 로그인한 유저를 받아오는건가보다 현재?
  User.find({ _id: { $ne: loggedInUserId } })
    // 현재 로그인한 유저 빼고 전부다 가져오기.
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log("에러 리트라이빙 유저", err);
      res.status(500).json({ message: "에러 리트라이빙 유저스" });
    });
});

//친구추가 요청 수락하면 + socket.Io
app.post("/friend-request/accept", async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;

    // senderId가 요청한사람
    // recepientId가 받은 사람

    // 송신자 , 수신자 검색
    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);

    sender.friends.push(recepientId);
    recepient.friends.push(senderId);

    // recipient의 친구 요청 받는 목록에서 sender의 요청을 제거
    recepient.freindRequests = recepient.freindRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request) => request.toString() !== recepientId.toString
    );

    await sender.save();
    await recepient.save();
    //friendRequestAccepted

    // 객체로 오고있었음 . 이거  recepient.id =>
    io.emit("friendRequestAccepted", { newFriend: recepient });
    // 수락받았다는걸 io 로 보냄

    res.status(200).json({ message: "Friend Request accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 친구목록 조회해서 이름 이메일 이미지 불러오는 코드
app.get("/accepted-friends/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "name email image"
    );
    const acceptedFriends = user.friends;
    res.json(acceptedFriends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const multer = require("multer");

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//채팅방 생성
app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user data from the user ID
    const recepientId = await User.findById(userId);

    res.json(recepientId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//채팅 내역을 불러옴
app.get("/messages/:senderId/:recepientId", async (req, res) => {
  try {
    const { senderId, recepientId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//메세지를 지움
app.post("/deleteMessages", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "invalid req body!" });
    }

    await Message.deleteMany({ _id: { $in: messages } });

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server" });
  }
});

// 로그인한 유저에게서 친구가 누군지 받아옴
app.get("/friends/:userId", (req, res) => {
  try {
    const { userId } = req.params; // userId 를 받아와서

    User.findById(userId)
      .populate("friends")
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const friendIds = user.friends.map((friend) => friend._id);

        res.status(200).json(friendIds);
      });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "internal server error" });
  }
});

app.get("/driverList", async (req, res) => {
  // 요청은 없고요.
  try {
    const drivers = await Driver.find({}); // 모든 드라이버 데이터 검색
    res.status(200).json(drivers); // 검색 결과를 JSON 형식으로 반환
  } catch (error) {
    res.status(500).json({ message: "서버 오류 발생", error: error });
  }
});

//기사 요청 받는 부분
app.get("/confirmRequest/:driverId", async (req, res) => {
  try {
    const driverId = req.params.driverId;

    // 요청 ID를 사용하여 요청 정보를 조회
    const request = await Request.findById({ driverId: driverId });

    if (!request) {
      return res.status(404).json({ message: "요청을 찾을 수 없습니다." });
    }

    // 여기에서 운전사의 확인 로직을 수행하고 필요한 응답을 반환

    res.status(200).json({ request });
  } catch (error) {
    console.error("오류:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

//socket.io
const portR = 8001;
// 연결된 클라이언트를 저장하기 위한 맵 (MongoDB ID와 Socket ID 매핑)
const clientSocketIdMap = new Map();

server.listen(portR, () => {
  console.log(`io 서버 실행 중, 포트 ${portR}`);
});
io.on("connection", (socket) => {
  socket.on("passengerConnect", (passengerId) => {
    console.log(`탑승자가 연결되었습니다. Passenger ID: ${passengerId}`);
    clientSocketIdMap.set(passengerId, socket.id);
  });

  // 클라이언트로부터 메시지를 받았을 때 처리
  socket.on("sendMessage", async (formData) => {
    try {
      // formData에서 필요한 정보 추출
      const senderId = formData.senderId;
      const recepientId = formData.recepientId;
      const messageType = formData.messageType;

      // 이곳에서 메시지를 처리하고 저장하는 로직을 추가
      // 예를 들어, MongoDB를 사용해 메시지를 저장할 수 있습니다.

      // MongoDB를 사용하여 메시지 저장 (mongoose 모델이 있다고 가정)
      const newMessage = new Message({
        senderId: senderId,
        recepientId: recepientId,
        messageType: messageType,
        message: formData.message, // 텍스트 메시지
        imageUrl: formData.imageUrl, // 이미지 메시지
        timestamp: new Date(),
      });
      await newMessage.save();
      // 저장한 메시지를 다른 클라이언트에게 다시 보내는 예제 코드

      console.log("보낼 : ", newMessage);
      io.emit("receiveMessage", formData);
      //io.to(recepientId).emit('receiveMessage', formData);
    } catch (error) {
      console.error("Error processing and saving the message:", error);
    }
  });

  // 운전사 연결 이벤트
  socket.on("driverConnect", (driverId) => {
    console.log(`운전사가 연결되었습니다. Driver ID: ${driverId}`);
    clientSocketIdMap.set(driverId, socket.id);
  });

  // 탑승자의 요청을 운전사에게 전송
  socket.on("passengerRequest", async (request) => {
    console.log("탑승자의 요청이 수신되었습니다.", request);
    const driverSocketId = clientSocketIdMap.get(request.driverId._id);

    console.log(driverSocketId, "드라이버소켓아이디");
    const driver = await Driver.findOne({ _id: request.driverId._id });
    console.log(driver, "드라이버");

    if (driverSocketId) {
      // Mongoose 모델을 사용하여 운전사를 찾음
      try {
        if (driver) {
          if (driver.driveState === false) {
            // 운전사의 driveState가 false인 경우 요청 거절 또는 특정 처리
            console.log(
              `해당 운전사는 운행중이 아닙니다. Driver ID: ${request.driverId._id}`
            );
            // 여기에서 요청 거절 처리 또는 특정 처리를 수행할 수 있습니다.
          } else {
            // 해당 운전사에게 요청 전송
            io.to(driverSocketId).emit("passengerRequestToDriver", request); // 보내는거
            console.log(
              `요청을 운전사에게 전송했습니다. Driver ID: ${request.driverId._id}`
            );
          }
        } else {
          console.log(
            `운전사를 찾을 수 없습니다. Driver ID: ${request.driverId._id}`
          );
        }
      } catch (err) {
        console.error(`운전사 조회 중 오류 발생: ${err}`);
      }
    } else {
      console.log(
        `운전사를 찾을 수 없습니다1. Driver ID: ${request.driverId._id}`
      );
    }
  });

  // 운전사의 응답을 탑승자에게 전송
  socket.on("acceptRejectRequest", (request) => {
    console.log("서버가 받은 운전사의 응답 :", request);

    console.log(request.requestId);
    // requestId를 사용하여 해당 탑승자의 소켓 ID를 가져옵니다.
    const passengerSocketId = clientSocketIdMap.get(request.requestId);
    if (passengerSocketId) {
      // 해당 탑승자에게 운전사의 응답 전송
      io.to(passengerSocketId).emit("acceptRejectRequestToPassenger", request);
      console.log(
        `운전사의 응답을 탑승자에게 전송했습니다. Request ID: ${request.requestId}`
      );
    } else {
      console.log(
        `탑승자를 찾을 수 없습니다. Request ID: ${request.requestId}`
      );
    }
  });

  // 연결 해제 시 매핑 정보 제거
  socket.on("disconnect", () => {
    for (const [id, socketId] of clientSocketIdMap.entries()) {
      if (socketId === socket.id) {
        clientSocketIdMap.delete(id);
        console.log(`클라이언트가 연결을 해제했습니다. ID: ${id}`);
        break;
      }
    }
  });
});
