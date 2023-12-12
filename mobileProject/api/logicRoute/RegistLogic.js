const express = require("express");
const router = express.Router();
const User = require("../models/user")
const Driver = require("../models/driver")

// 사용자 등록을 위한 라우트 핸들러
router.post("/register", (req, res) => {
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

router.post("/registerT", (req, res) => {
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

module.exports = router;