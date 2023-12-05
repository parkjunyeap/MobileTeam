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
const Driver = require("./models/driver"); // 드라이버가 왜 자꾸 누락됐데
const Review = require("./models/review");
const ReviewT = require("./models/reviewT"); // 택시기사 리뷰 db 따로뺏쥬
const Payment = require("./models/payment");
const Booking = require("./models/booking");

// 예약 저장 됨.. 근데 너무간단
app.post("/bookings", async (req, res) => {
  try {
    const newBooking = new Booking({
      bookingDate: req.body.bookingDate,
      bookingTime: req.body.bookingTime,
      boarderId: req.body.boarderId,
      driverId: req.body.driverId,
      startPoint: req.body.startPoint,
      endPoint: req.body.endPoint,
    });

    await newBooking.save(); // 데이터베이스에 예약 저장
    res.status(201).send(newBooking); // 성공적으로 저장된 예약 객체 반환
  } catch (error) {
    res.status(400).send(error); // 에러 처리
  }
});
// 요기 오류날 수 있는 부분 // 리뷰쓰기
app.post("/write/reviews", (req, res) => {
  // 요청받아
  console.log(req);
  const { senderId, receiverId, rating, comment } = req.body; // 클라이언트에서 전달한 데이터에서 title과 score를 추출
  const newReview = new Review({
    senderId,
    receiverId,
    rating,
    comment,
  });
  newReview
    .save()
    .then(() => {
      res.status(200).json({ message: "유저가 성공적으로 등록됐다." });
    })
    .catch((err) => {
      console.log("에러발생 등록못함", err);
      res.status(500).json({ message: "에러발생 등록못함" });
    });
});

// 요기 오류날 수 있는 부분
app.post("/write/driverReviews", (req, res) => {
  // 요청받아

  console.log(req);
  const { senderId, receiverId, rating, comment } = req.body; // 클라이언트에서 전달한 데이터에서 title과 score를 추출

  const newReviewT = new ReviewT({
    senderId,
    receiverId,
    rating,
    comment,
  });

  newReviewT
    .save()
    .then(() => {
      res.status(200).json({ message: "택시기사 리뷰가 성공적으로 등록됐다." });
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

app.post("/registerT", (req, res) => {
  // 클라이언트로부터 받은 데이터에서 이름, 이메일, 비밀번호, 이미지를 추출
  const {
    name,
    email,
    password,
    image,
    imaget,
    licenseNumber,
    carNumber,
    carName,
    getDate,
    birthdate,
    province,
    city,
    driverState,
  } = req.body;

  // 새로운 User 모델 인스턴스를 생성
  const newDriver = new Driver({
    name,
    email,
    password,
    image,
    imaget,
    licenseNumber,
    carNumber,
    carName,
    getDate,
    birthdate,
    province,
    city,
    driverState,
  });

  // 데이터베이스에 새로운 사용자 저장 시도
  newDriver
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
  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "2m" });
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

// 로그인을 위한 라우트 핸들러
app.post("/loginT", (req, res) => {
  // 클라이언트로부터 받은 데이터에서 이메일과 비밀번호를 추출
  const { email, password } = req.body;
  console.log("잘받았는지 확인", req.body);
  // 이메일과 비밀번호가 제공되지 않았을 경우 404 상태 코드로 오류 메시지 응답
  if (!email || !password) {
    return res.status(404).json({ message: "이메일 이랑 비밀번호는 필수야" });
  }

  // User 모델을 사용하여 제공된 이메일과 일치하는 사용자 검색
  Driver.findOne({ email })
    .then((driver) => {
      if (!driver) {
        return res.status(404).json({ message: "그런 유저없음" });
      }

      // 제공된 비밀번호가 데이터베이스의 비밀번호와 일치하지 않는 경우 404 상태 코드로 오류 메시지 응답
      if (driver.password !== password) {
        return res.status(404).json({ message: "비밀번호 불일치" });
      }

      // 비밀번호가 일치하는 경우, 사용자 ID로 토큰 생성
      const token = createToken(driver._id);
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

app.post("/UpTInfo", async (req, res) => {
  // 클라이언트로부터 받은 데이터에서 이름, 이메일, 비밀번호, 이미지를 추출
  console.log(req.body);
  const userId = req.body.userId;

  // 새로운 User 모델 인스턴스를 생성
  const newTInfo = await Driver.findOneAndUpdate(
    { _id: userId },
    {
      image: req.body.image,
      birthdate: req.body.birthdate,
      province: req.body.province,
      city: req.body.city,
    },
    { new: true, upsert: true }
  );
  // 데이터베이스에 새로운 사용자 저장 시도
  newTInfo
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

// endpoint to access all the users except the user who's is currently logged in!

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

app.get("/drivers/:userId", (req, res) => {
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

//친구추가요청 잘됐는지 불러옴
app.post("/friend-request", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;
  console.log("이거 왜 ", currentUserId);
  // 현재 친구추가 누른 사람 아이디
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

// 친구요청 보낸 사람 목록 조회하는거지 맞아 근데 이걸 프론트엔드에서 썻나? 안씀.
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

// 로그인한 유저에게서 친구가 누군지 받아오는 코드구나~
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

// setTaxiMateInfo 택시정보 저장하기
app.post("/setTaxiMateInfo", async (req, res) => {
  try {
    // 사용자 인증 및 권한 확인 (여기서는 예시로 userId를 요청에서 가져옴)
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: "userId가 제공되지 않았습니다." });
      console.log("userId가 제공되지 않았습니다.");
    }

    // 사용자 정보 업데이트
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        image: req.body.image,
        infoSetting: {
          province: req.body.province,
          city: req.body.city,
          favoriteStartPoint: req.body.favoriteStartPoint,
          favoriteEndPoint: req.body.favoriteEndPoint,
          favoriteTimeFrame1: {
            hour: req.body.favoriteTimeFrame1[0],
            minute: req.body.favoriteTimeFrame1[1],
          },
          favoriteTimeFrame2: {
            hour: req.body.favoriteTimeFrame2[0],
            minute: req.body.favoriteTimeFrame2[1],
          },
        },
      },
      { new: true, upsert: true } // upsert 옵션을 사용하여 새 사용자를 생성하거나 기존 사용자를 업데이트
    );
    console.log(updatedUser);
    // 업데이트된 사용자 정보 반환
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("사용자 택시 정보 업데이트 오류:", error);
    res.status(500).json({ error: "서버 오류 발생" });
  }
});

// app.get("/ViewTaxiMateInfo/:userId", async (req, res) => {
//   try {
//     // URL 파라미터에서 userId 추출
//     const { userId } = req.params; // 프론트엔드에서 userId 만 보냄

//     // 데이터베이스에서 userId를 기준으로 사용자의 infoSetting 정보만 조회
//     const userInfo = await User.findById(userId).select("infoSetting -_id"); //_id 로 조회
//     console.log("데이터베이스에서 잘받아오나요?", userInfo);
//     // 잘받아오네요
//     // userInfo가 존재하면 infoSetting 필드만 클라이언트에게 JSON 형태로 전송

//     if (userInfo) {
//       res.json(userInfo);
//     } else {
//       // 사용자를 찾을 수 없는 경우 404 에러 전송
//       res.status(404).send("User not found");
//     }
//   } catch (error) {
//     // 에러 처리
//     console.error("Server error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.get("/ViewTaxiMateInfo/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // 프론트엔드에서 userId 만 보냄

    // 데이터베이스에서 userId를 기준으로 사용자의 infoSetting 정보와 name도 조회
    const userInfo = await User.findById(userId).select(
      "infoSetting name image -_id" // 이름까지 같이 받아옴
    );

    console.log("데이터베이스에서 잘받아오나요?", userInfo);
    // 잘받아오네요
    if (userInfo) {
      res.json(userInfo);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 리뷰 받은사람 기준 리뷰
// 서버로부터 보내주기

// app.get("/reviews/receiver/:userId", (req, res) => {
//   const receiverId = req.body;
//   console.log(receiverId); // 아이디

//   // 받은 id 로
//   Review.find({ receiverId })
//     .then((reviews) => {
//       res.json(reviews);
//       console.log(reviews);
//     })
//     .catch((err) => {
//       res.json({
//         message: "나에게 남긴 리뷰 조회 실패",
//       });
//     });
// });

app.get("/reviews/receiver/:userId", (req, res) => {
  const receiverId = req.params.userId; // URL 경로에서 userId 추출
  console.log(receiverId); // 아이디 로깅

  // receiverId를 사용하여 리뷰 검색
  Review.find({ receiverId: new mongoose.Types.ObjectId(receiverId) })
    .then((reviews) => {
      console.log(reviews);
      res.json(reviews);
    })
    .catch((err) => {
      res.json({
        message: "나에게 남긴 리뷰 조회 실패",
      });
    });
});

// 위에 있는게

// Express.js 라우트 핸들러

// 해당 사람에 리뷰
// 자신이 받은 리뷰  구현
app.get("/reviews/receiver/user/:userId", async (req, res) => {
  const receiverId = req.params.userId; // URL 경로에서 userId 추출
  try {
    const reviews = await Review.find({ receiverId: receiverId }) // Review.find(리시브아이디가 : 요청받은리시브아이디)랑 일치하는지 ?
      .populate("senderId", "name") // senderId를 참조하여 name 필드만 가져옴 senderId 에 name을 가져옴
      .populate("receiverId", "name"); // receiverId를 참조하여 name 필드만 가져옴

    // JSON 형태로 변환하여 클라이언트에게 보내기 이름으로된거
    const reviewsWithNames = reviews.map((review) => ({
      _id: review._id,
      senderName: review.senderId.name, // sender의 이름
      receiverName: review.receiverId.name, // receiver의 이름
      rating: review.rating,
      comment: review.comment,
      reviewDate: review.reviewDate,
    }));

    res.json(reviewsWithNames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});

app.get("/reviews/receiver/driver/:userId", async (req, res) => {
  const receiverId = req.params.userId; // URL 경로에서 userId 추출
  try {
    const reviewsT = await ReviewT.find({ receiverId: receiverId }) // Review.find(리시브아이디가 : 요청받은리시브아이디)랑 일치하는지 ?
      .populate("senderId", "name") // senderId를 참조하여 name 필드만 가져옴 senderId 에 name을 가져옴
      .populate("receiverId", "name"); // receiverId를 참조하여 name 필드만 가져옴

    console.log(reviewsT);
    // JSON 형태로 변환하여 클라이언트에게 보내기 이름으로된거
    const reviewsWithNames = reviewsT.map((review) => ({
      _id: review._id,
      senderName: review.senderId.name, // sender의 이름
      receiverName: review.receiverId.name, // receiver의 이름
      rating: review.rating,
      comment: review.comment,
      reviewDate: review.reviewDate,
    }));

    res.json(reviewsWithNames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});

// 친구 찾기 조건 : 도, 시 , 출발지 ,목적지.

app.post("/FindTaxiMateDetail", async (req, res) => {
  try {
    const { userId, province, city, favoriteStartPoint, favoriteEndPoint } =
      req.body;
    // MongoDB에서 사용자 정보를 조회
    console.log("데이터 확인 :", req.body);

    const userPC = await User.find({
      _id: { $ne: userId },
      "infoSetting.province": province,
      "infoSetting.city": city,
    });
    const userSE = await User.find({
      _id: { $ne: userId },
      "infoSetting.favoriteStartPoint": favoriteStartPoint,
      "infoSetting.favoriteEndPoint": favoriteEndPoint,
    });

    //   // 지역별로 검색할 수 잇게 바꿈일단
    // });
    console.log("Searched by 도/시", userPC);
    console.log("Searched by 주 이용 위치", userSE);
    if ((!userPC || userPC.length === 0) && (!userSE || userSE.length === 0)) {
      // 해당하는 사용자를 찾지 못한 경우 에러 응답
      return res.status(404).json({ message: "해당되는 사용자가 없습니다." });
    }

    // 사용자 정보를 클라이언트에 응답
    res.status(200).json({ userPC, userSE });
  } catch (error) {
    console.error("오류:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

//택시운전사에서의 내정보 불러오기
app.get("/getMyTaxiInfo/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // 프론트엔드에서 userId 만 보냄

    // 데이터베이스에서 userId를 기준으로 사용자의 infoSetting 정보와 name도 조회
    const driverInfo = await Driver.findById(userId).populate(
      "name email image imaget carNumber carName licenseNumber getDate birthdate province city"
    );

    console.log("데이터베이스에서 잘받아오나요?", driverInfo);
    // 잘받아오네요
    if (driverInfo) {
      res.json(driverInfo);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 이건 senderID를 기준으로 찾아서 내가 택시기사님에게 보낸 리뷰 만 볼 수 있음.
// 이건 아직 post 로 기사님에게 하는건 안했음.
// get 도 택시기사님에 접근해야하는데 잘되나..?? 확인해야됨

app.get("/reviews/sender/:userId", async (req, res) => {
  // /reviewsT/sender/ TTTTTTTTTTT 가 들어감.
  const senderId = req.params.userId; // URL 경로에서 userId 추출
  try {
    const reviews = await Review.find({ senderId: senderId }) // Review.find(리시브아이디가 : 요청받은리시브아이디)랑 일치하는지 ?
      .populate("senderId", "name") // senderId를 참조하여 name 필드만 가져옴 senderId 에 name을 가져옴
      .populate("receiverId", "name"); // receiverId를 참조하여 name 필드만 가져옴

    // JSON 형태로 변환하여 클라이언트에게 보내기 이름으로된거
    const reviewsWithNames = reviews.map((review) => ({
      _id: review._id,
      senderName: review.senderId.name, // sender의 이름
      receiverName: review.receiverId.name, // receiver의 이름
      rating: review.rating,
      comment: review.comment,
      reviewDate: review.reviewDate,
    }));

    res.json(reviewsWithNames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});

app.get("/reviewsT/sender/:userId", async (req, res) => {
  // /reviewsT/sender/ TTTTTTTTTTT 가 들어감.
  const senderId = req.params.userId; // URL 경로에서 userId 추출
  try {
    const reviews = await ReviewT.find({ senderId: senderId }) // Review.find(리시브아이디가 : 요청받은리시브아이디)랑 일치하는지 ?
      .populate("senderId", "name") // senderId를 참조하여 name 필드만 가져옴 senderId 에 name을 가져옴
      .populate("receiverId", "name"); // receiverId를 참조하여 name 필드만 가져옴

    // JSON 형태로 변환하여 클라이언트에게 보내기 이름으로된거
    const reviewsWithNames = reviews.map((review) => ({
      _id: review._id,
      senderName: review.senderId.name, // sender의 이름
      receiverName: review.receiverId.name, // receiver의 이름
      rating: review.rating,
      comment: review.comment,
      reviewDate: review.reviewDate,
    }));

    res.json(reviewsWithNames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});

// 한번 딱 넣어봣음.
// 이걸 나중에 post 메소드로 ㅇㅇ
const insertDummyData = async () => {
  const dummyData = {
    boarderId: "656203a7e05543faf0d7a0b3", // 테스트로 park / park
    driverId: "6569a600f3abe1ee79d45bb7", // test 위해서 Driver1@naver.com / 1111
    boardingDate: "2023-09-17T12:00:00.000Z",
    startPoint: "서울역",
    endPoint: "강남역",
    pay: "15000",
  };

  try {
    const payment = new Payment(dummyData);
    await payment.save();
    console.log("더미 데이터가 성공적으로 삽입되었습니다.");
  } catch (error) {
    console.error("더미 데이터 삽입 실패:", error);
  }
};

// myInfo 에서 이름뜨게 어떻게 했더라?이름까지 받아왔었구나 ok 이름까지주자

// 결제내역에는 일단 이정도만??
app.get("/payments/boarderId/:userId", async (req, res) => {
  const boarderId = req.params.userId; // URL 경로에서 userId 추출
  console.log(boarderId);
  try {
    const payments = await Payment.find({ boarderId: boarderId }) // Review.find(리시브아이디가 : 요청받은리시브아이디)랑 일치하는지 ?
      .populate("boarderId", "name") // senderId를 참조하여 name 필드만 가져옴 senderId 에 name을 가져옴
      .populate("driverId", "name carNumber", "Driver") // driverId를 참조하여 name 하고 차량번호 가져옴

      // .populate("driverId", "name carNumber" )  원래이건데
      .lean();

    console.log(payments);

    // JSON 형태로 변환하여 클라이언트에게 보내기 이름으로된거
    const paymentsWithNameNumber = payments.map((Payment) => ({
      _id: Payment._id,
      boarderName: Payment.boarderId.name, // sender의 이름
      driverName: Payment.driverId.name, // 드라이버 의 이름
      carNumber: Payment.driverId.carNumber, //  드라이버의 차량번호
      boardingDate: Payment.boardingDate,
      startPoint: Payment.startPoint,
      endPoint: Payment.endPoint,
      pay: Payment.pay,
    }));

    console.log(paymentsWithNameNumber);
    res.json(paymentsWithNameNumber);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});

//택시기사 결제내역

// 결제내역에는 일단 이정도만?? // 결제내역 , 기사 아이디로 찾기
app.get("/payments/driverId/:userId", async (req, res) => {
  const driverId = req.params.userId; // URL 경로에서 userId 추출
  console.log(driverId);
  try {
    const payments = await Payment.find({ driverId: driverId }) // Review.find(리시브아이디가 : 요청받은리시브아이디)랑 일치하는지 ?
      .populate("boarderId", "name") // senderId를 참조하여 name 필드만 가져옴 senderId 에 name을 가져옴
      .populate("driverId", "name carNumber", "Driver") // driverId를 참조하여 name 하고 차량번호 가져옴

      // .populate("driverId", "name carNumber" )  원래이건데
      .lean();

    console.log(payments);

    // JSON 형태로 변환하여 클라이언트에게 보내기 이름으로된거
    const paymentsWithNameNumber = payments.map((Payment) => ({
      _id: Payment._id,
      boarderName: Payment.boarderId.name, // sender의 이름
      driverName: Payment.driverId.name, // 드라이버 의 이름
      carNumber: Payment.driverId.carNumber, //  드라이버의 차량번호
      boardingDate: Payment.boardingDate,
      startPoint: Payment.startPoint,
      endPoint: Payment.endPoint,
      pay: Payment.pay,
    }));

    console.log(paymentsWithNameNumber);
    res.json(paymentsWithNameNumber);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});
// 경로 대소문자 구분: Mongoose는 모델 이름을 대소문자를 구분하여 처리합니다.
//  driverSchema를 'Driver'로 등록했다면, populate 메소드에서도 'Driver'를 사용해야 합니다.
//   populate("driverId", "name carNumber") 대신 populate("driverId", "name carNumber", "Driver")를 사용해보세요.

// 이렇게 하는게 맞는지 모르겠는데 이런느낌임

app.get("/driverList", async (req, res) => {
  // 요청은 없고요.
  try {
    const drivers = await Driver.find({}); // 모든 드라이버 데이터 검색
    res.status(200).json(drivers); // 검색 결과를 JSON 형식으로 반환
  } catch (error) {
    res.status(500).json({ message: "서버 오류 발생", error: error });
  }
});

app.get("/driverList/payment/:userId", async (req, res) => {
  // /driverList/payment/:userId
  const userId = req.params.userId; // URL에서 userId 파라미터 받기

  // params로 해야되는구나

  console.log("userID잘받아옴? 왜 잘못받아옴??", userId);
  try {
    // Payment 데이터베이스에서 해당 userId의 결제 내역 검색
    const payments = await Payment.find({ boarderId: userId });

    console.log(payments);
    // 결제 내역에서 모든 driverId 추출
    const driverIds = payments.map((payment) => payment.driverId);

    // Driver 데이터베이스에서 해당 driverId의 드라이버 검색
    const drivers = await Driver.find({ _id: { $in: driverIds } });

    console.log(drivers);

    res.status(200).json(drivers); // 검색 결과를 JSON 형식으로 반환
  } catch (error) {
    res.status(500).json({ message: "서버 오류 발생", error: error });
  }
});

// 부킹 드라이버
app.get("/driverList/booking/:userId", async (req, res) => {
  // /driverList/payment/:userId
  const userId = req.params.userId; // URL에서 userId 파라미터 받기

  // params로 해야되는구나

  console.log("userID잘받아옴? 왜 잘못받아옴??", userId);
  try {
    // Payment 데이터베이스에서 해당 userId의 결제 내역 검색
    const bookings = await Booking.find({ boarderId: userId });

    console.log(bookings);
    // 예약 내역에서 모든 driverId 추출
    const driverIds = bookings.map((booking) => booking.driverId);

    // Driver 데이터베이스에서 해당 driverId의 드라이버 검색
    const drivers = await Driver.find({ _id: { $in: driverIds } });

    console.log(drivers);

    res.status(200).json(drivers); // 검색 결과를 JSON 형식으로 반환
  } catch (error) {
    res.status(500).json({ message: "서버 오류 발생", error: error });
  }
});

// app.get("/users/:userId", (req, res) => {
//   const loggedInUserId = req.params.userId;
//   // 로그인한 유저를 받아오는건가보다 현재?
//   User.find({ _id: { $ne: loggedInUserId } })
//     // 현재 로그인한 유저 빼고 전부다 가져오기.
//     .then((users) => {
//       res.status(200).json(users);
//     })
//     .catch((err) => {
//       console.log("에러 리트라이빙 유저", err);
//       res.status(500).json({ message: "에러 리트라이빙 유저스" });
//     });
// });

// 드라이버 더미 데이터 예시
// const driverData = {
//   name: "김철수", // 예시 이름
//   email: "chulsoo.kim@example.com", // 예시 이메일
//   password: "securePassword123!", // 예시 비밀번호
//   image: "profile_pic_chulsoo.jpg", // 예시 프로필 이미지 파일명
//   imaget: "driver_license_chulsoo.jpg", // 예시 자격증 이미지 파일명
//   carNumber: "서울 123가 4567", // 예시 차량 번호
//   carName: "Kia K5", // 예시 차량 이름
//   licenseNumber: "01-23456789", // 예시 자격증 번호
//   getDate: "2023-01-01", // 예시 습득 날짜
//   driveState: false, // 예시 운행 상태
//   birthdate: new Date("1980-04-15"), // 예시 생년월일
//   province: "서울특별시", // 예시 도
//   city: "강남구", // 예시 시
// };

// const driverData2 = {
//   name: "박영희", // 예시 이름
//   email: "younghui.park@example.com", // 예시 이메일
//   password: "securePassword456!", // 예시 비밀번호
//   image: "profile_pic_younghui.jpg", // 예시 프로필 이미지 파일명
//   imaget: "driver_license_younghui.jpg", // 예시 자격증 이미지 파일명
//   carNumber: "인천 789나 1011", // 예시 차량 번호
//   carName: "Hyundai Sonata", // 예시 차량 이름
//   licenseNumber: "02-98765432", // 예시 자격증 번호
//   getDate: "2023-02-15", // 예시 습득 날짜
//   driveState: true, // 예시 운행 상태
//   birthdate: new Date("1985-08-25"), // 예시 생년월일
//   province: "인천광역시", // 예시 도
//   city: "부평구", // 예시 시
// };
// // 더미 데이터를 데이터베이스에 저장하는 예시 코드
// const newDriver = new Driver(driverData2);
// newDriver
//   .save()
//   .then(() => console.log("더미 데이터가 성공적으로 저장되었습니다."))
//   .catch((err) => console.error("데이터 저장 중 오류 발생: ", err));

// 여기서 부터할차례
app.get("/Booking/boarderId/:userId", async (req, res) => {
  const boarderId = req.params.userId; // URL 경로에서 userId 추출
  console.log(boarderId);
  try {
    const bookings = await Booking.find({ boarderId: boarderId }) // Review.find(리시브아이디가 : 요청받은리시브아이디)랑 일치하는지 ?
      .populate("boarderId", "name") // senderId를 참조하여 name 필드만 가져옴 senderId 에 name을 가져옴
      .populate("driverId", "name", "Driver") // driverId를 참조하여 name 하고 차량번호 가져옴
      // 이런식으로 써줘야한다고 하더라고?

      // .populate("driverId", "name carNumber" )  원래이건데
      .lean();

    console.log("이게 db에서 갖고오는거: ", bookings);

    // JSON 형태로 변환하여 클라이언트에게 보내기 이름으로된거
    const bookingsWithName = bookings.map((Booking) => ({
      _id: Booking._id,
      bookingDate: Booking.bookingDate,
      bookingTime: Booking.bookingTime,
      boarderName: Booking.boarderId.name, // sender의 이름
      driverName: Booking.driverId.name, // 드라이버 의 이름
      startPoint: Booking.startPoint,
      endPoint: Booking.endPoint,
    }));
    console.log("이게JSON가공", bookingsWithName);
    res.json(bookingsWithName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});

// 드라이버 아이디로 유저를 찾을때,,
app.get("/Booking/driverId/:userId", async (req, res) => {
  const driverId = req.params.userId; // URL 경로에서 userId 추출
  console.log(driverId);
  try {
    const bookings = await Booking.find({ driverId: driverId }) // Review.find(리시브아이디가 : 요청받은리시브아이디)랑 일치하는지 ?
      .populate("boarderId", "name") // senderId를 참조하여 name 필드만 가져옴 senderId 에 name을 가져옴
      .populate("driverId", "name", "Driver") // driverId를 참조하여 name 하고 차량번호 가져옴
      // 이런식으로 써줘야한다고 하더라고?

      // .populate("driverId", "name carNumber" )  원래이건데
      .lean();

    console.log("이게 db에서 갖고오는거: ", bookings);

    // JSON 형태로 변환하여 클라이언트에게 보내기 이름으로된거
    const bookingsWithName = bookings.map((Booking) => ({
      _id: Booking._id,
      bookingDate: Booking.bookingDate,
      bookingTime: Booking.bookingTime,
      boarderName: Booking.boarderId.name, // sender의 이름 // 여기 부킹 한사람의 이름이 null 이다
      driverName: Booking.driverId.name, // 드라이버 의 이름
      startPoint: Booking.startPoint,
      endPoint: Booking.endPoint,
    }));
    console.log("이게JSON가공", bookingsWithName);
    res.json(bookingsWithName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});

// 예약 삭제 라우트 부킹삭제
app.delete("/booking/del/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.bookingId);

    console.log(booking);
    // 잘갖고왔는지아이디..
    if (!booking) {
      return res.status(404).send("No booking found");
    }
    res.status(200).send("Booking deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

// 리뷰 삭제를 하는데,, WriteId랑 유저아이디랑 비교해서 일치하는 아이디만 삭제가능하게 하고싶은데 ???

app.delete("/Review/del/:writeId", async (req, res) => {
  // 리뷰 삭제
  try {
    const review = await Review.findByIdAndDelete(req.params.writeId);

    console.log(review);
    // 잘갖고왔는지아이디..
    if (!review) {
      return res.status(404).send("No review found");
    }
    res.status(200).send("Review deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});
