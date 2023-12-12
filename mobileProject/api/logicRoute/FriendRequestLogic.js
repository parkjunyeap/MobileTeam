const express = require("express");
const router = express.Router();
const User = require("../models/user");

//친구추가요청 잘됐는지 불러옴
router.post("/friend-request", async (req, res) => {
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
router.get("/friend-request/:userId", async (req, res) => {
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

// 친구요청 보낸 사람 목록 조회
router.get("/friend-requests/sent/:userId", async (req, res) => {
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

module.exports = router;