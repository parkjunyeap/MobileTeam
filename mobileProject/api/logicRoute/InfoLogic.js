const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Driver = require("../models/driver");

//탑승자의 내정보를 불러옴
router.get("/ViewTaxiMateInfo/:userId", async (req, res) => {
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

//탑승자의 내정보 업데이트
router.post("/setTaxiMateInfo", async (req, res) => {
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
                    selectedDays: req.body.selectedDays,
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

// 친구 찾기 조건 : 도, 시 , 출발지 ,목적지.
router.post("/FindTaxiMateDetail", async (req, res) => {
    try {
        const {
            userId,
            province,
            city,
            favoriteStartPoint,
            favoriteEndPoint,
            selectedDays,
        } = req.body;
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
            "infoSetting.selectedDays": { $in: selectedDays },
        });

        //지역별로 검색할 수 잇게 바꿈일단
        if (userPC.length > 0) {
            userPC.forEach((user) => {
                console.log("Searched by 도/시", user._id);
            });
        } else {
            console.log("Searched by 도/시 - No Results Found");
        }
        if (userSE.length > 0) {
            userSE.forEach((user) => {
                console.log("Searched by 주 이용 위치", user._id);
            });
        } else {
            console.log("Searched by 주 이용 위치 - No Results Found");
        }
        //console.log("Searched by 주 이용 위치", userSE);
        if ((!userPC || userPC.length === 0) && (!userSE || userSE.length === 0)) {
            // 해당하는 사용자를 찾지 못한 경우 에러 응답
            return res.status(200).json({ userPC, userSE });
        }

        // 사용자 정보를 클라이언트에 응답
        res.status(200).json({ userPC, userSE });
    } catch (error) {
        console.error("오류:", error.message);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});

//운전사의 내정보 불러오기
router.get("/getMyTaxiInfo/:userId", async (req, res) => {
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


//운전사 내정보 업데이트
router.post("/UpTInfo", async (req, res) => {
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

//운전사 운행 상태 업데이트
router.post("/UpDriveState", async (req, res) => {
    const userId = req.body.userId;
    const upDS = await Driver.findOneAndUpdate(
        { _id: userId },
        { $set: { driverState: req.body.driverState } },
        { new: true }
    );
    // 데이터베이스에 새로운 사용자 저장 시도
    upDS
        .save()
        .then(() => {
            // 저장 성공 시 200 상태 코드와 함께 성공 메시지 응답
            res.status(200).json({ message: "운행상태 변경완료." });
        })
        .catch((err) => {
            // 저장 실패 시 콘솔에 에러 로깅하고 500 상태 코드로 클라이언트에게 오류 메시지 응답
            console.log("에러발생 변경못함", err);
            res.status(500).json({ message: "에러발생 변경못함" });
        });
});

module.exports = router;