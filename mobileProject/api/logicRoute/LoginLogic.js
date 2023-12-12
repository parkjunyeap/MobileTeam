const express = require("express");
const router = express.Router();
const User = require("../models/user")
const Driver = require("../models/driver")

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
  router.post("/login", (req, res) => {
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
  router.post("/loginT", (req, res) => {
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

  module.exports = router;