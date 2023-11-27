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

// 임시 // 나중에바꿔야함
app.post("/reviews", (req, res) => {
  // 요청받아
  const { title, score } = req.body; // 클라이언트에서 전달한 데이터에서 title과 score를 추출
  // console.log(req.params);

  const newReview = new Review({ title, score });

  newReview
    .save()
    .then((user) => {
      console.log(user);
      res.json({
        message: "리뷰가 등록되었습니다",
      });
    })
    .catch((err) => {
      res.json({
        message: "리뷰 등록 실패",
      });
    });
});

// 사용자 등록을 위한 라우트 핸들러
app.post("/register", (req, res) => {
  // 클라이언트로부터 받은 데이터에서 이름, 이메일, 비밀번호, 이미지를 추출
  const { name, email, password, image } = req.body;

  // 새로운 User 모델 인스턴스를 생성
  const newUser = new User({ name, email, password, image });

  // 데이터베이스에 새로운 사용자 저장 시도
  newUser
    .save()
    .then(() => {
      // 저장 성공 시 200 상태 코드와 함께 성공 메시지 응답
      res.status(200).json({ message: "유저가 성공적으로 등록됐다." });
    })
    .catch((err) => {
      // 저장 실패 시 콘솔에 에러 로깅하고 500 상태 코드로 클라이언트에게 오류 메시지 응답
      console.log("에러발생 등록못함", err);
      res.status(500).json({ message: "에러발생 등록못함" });
    });
});

// 토큰 생성 함수
const createToken = (userId) => {
  // 페이로드에 userId 포함
  console.log("토큰만드는함수에서 유저아이디는 잘들어오나?", userId);
  const payload = {
    userId: userId,
  };

  // jsonwebtoken 라이브러리를 사용하여 페이로드와 비밀 키로 JWT 생성
  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });
  console.log("여기서 토큰을 발행못하나보다", token);
  // 생성된 토큰 반환하지만 현재 함수는 반환 값을 사용하지 않음. 반환 구문 추가 필요
  // 여기까지 토큰 발행잘하는데?
  return token;
};

// 로그인을 위한 라우트 핸들러
app.post("/login", (req, res) => {
  // 클라이언트로부터 받은 데이터에서 이메일과 비밀번호를 추출
  const { email, password } = req.body;
  console.log("잘받았는지 확인", req.body);

  // 이메일과 비밀번호가 제공되지 않았을 경우 404 상태 코드로 오류 메시지 응답
  if (!email || !password) {
    return res.status(404).json({ message: "이메일 이랑 비밀번호는 필수야" });
  }

  // User 모델을 사용하여 제공된 이메일과 일치하는 사용자 검색
  User.findOne({ email })
    .then((user) => {
      // 사용자가 없는 경우 404 상태 코드로 오류 메시지 응답
      if (!user) {
        return res.status(404).json({ message: "그런 유저없음" });
      }

      // 제공된 비밀번호가 데이터베이스의 비밀번호와 일치하지 않는 경우 404 상태 코드로 오류 메시지 응답
      if (user.password !== password) {
        return res.status(404).json({ message: "비밀번호 불일치" });
      }

      // 비밀번호가 일치하는 경우, 사용자 ID로 토큰 생성
      const token = createToken(user._id);
      console.log("잘받았구나", token);
      // 생성된 토큰을 응답으로 보냄
      res.status(200).json({ token });
    })
    .catch((error) => {
      // 사용자 검색 중 에러 발생 시 콘솔에 에러 로깅하고 500 상태 코드로 오류 메시지 응답
      console.log("에러 유저못찾음", error);
      res.status(500).json({ message: "내부서버오류" });
    });
});

// endpoint to access all the users except the user who's is currently logged in!

app.get("/users/:userId", (req, res) => {
  const loggedInUserId = req.params.userId;
  // 로그인한 유저를 받아오는건가보다 현재?
  User.find({ _id: { $ne: loggedInUserId } })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log("에러 리트라이빙 유저", err);
      res.status(500).json({ message: "에러 리트라이빙 유저스" });
    });
});

//친구추가
app.post("/friend-request", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    console.log("받기목록에 안뜨는거지? 왜?", currentUserId, selectedUserId); // 잘받았는데
    //update the recepient's friendRequestsArray! // 받는사람 이건 잘안됨 ,,
    await User.findByIdAndUpdate(selectedUserId, {
      // 여기서 선택한 유저아이디 를 프레인드리퀘스트

      $push: { freindRequests: currentUserId }, // 현재 로그인한 아이디를 집어넣음
    });
    console.log("받기목록을 빠져나온후 ", currentUserId, selectedUserId);
    //update the sender's sentFriendRequests array  // 보낸사람 이건 잘되는데
    await User.findByIdAndUpdate(currentUserId, {
      // 현재 아이디에
      $push: { sentFriendRequests: selectedUserId }, // 보낸 요청목록에 내가 선택한 친구를 집어넣음
    });

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// 친구목록 : 유저 아이디를 넘겨받으면
app.get("/friend-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // userId 집어넣어주고

    //해당 userId를 가진 유저를 데이터베이스에서 찾아서
    // 'friendRequests' 필드에 있는 유저들의 'name', 'email', 'image' 필드를 함께 불러옴
    const user = await User.findById(userId)
      .populate("freindRequests", "name email image") // ("그 필드", "에 잇는 유저들의 데이터")
      .lean(); // Mongoose 문서를 일반 자바스크립트 객체로 변환

    const freindRequests = user.freindRequests;
    // 그럼 결과적으로 이름 ,메일, 사진 데이터 보내줌 (친구목록에있는 친구들의)
    res.json(freindRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "내부서버오류" });
  }
});

//endpoint to accept a friend-request of a particular person
app.post("/friend-request/accept", async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;

    //retrieve the documents of sender and the recipient
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

    res.status(200).json({ message: "Friend Request accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 여기서 부터 그냥 복붙

//endpoint to access all the friends of the logged in user!
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

//endpoint to post Messages and store it in the backend
app.post("/messages", upload.single("imageFile"), async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body;

    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl: messageType === "image" ? req.file.path : null,
    });

    await newMessage.save();
    res.status(200).json({ message: "Message sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

///endpoint to get the userDetails to design the chat Room header
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

//endpoint to fetch the messages between two users in the chatRoom
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

//endpoint to delete the messages!
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

app.get("/friend-requests/sent/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("sentFriendRequests", "name email image")
      .lean();

    const sentFriendRequests = user.sentFriendRequests;

    res.json(sentFriendRequests);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Internal Server" });
  }
});

app.get("/friends/:userId", (req, res) => {
  try {
    const { userId } = req.params;

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
