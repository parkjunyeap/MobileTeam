const express = require("express");
const router = express.Router();
const Driver = require("../models/driver")

//운전자의 위치 보냄
router.post("/taxiLocation", async (req, res) => {
  // 여기서 userId는 택시기사 id요
  // 클라이언트로부터 userId, latitude, longitude를 받아서 처리 
  try {
    const { userId, latitude, longitude } = req.body;

    console.log("이게 왜 서버에 안불러와?", userId, latitude, longitude);

    const driver = await Driver.findOneAndUpdate(
      { _id: userId },
      {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      },
      { new: true, upsert: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "드라이버를 찾을 수 없습니다." });
    }

    // 응답 보내기
    res.status(200).json({ message: "위치 데이터 업데이트 완료" });
  } catch (error) {
    console.error("위치 업데이트 오류:", error);
    res.status(500).json({ message: "위치 업데이트 중 오류 발생" });
  }
});

//탑승자가 택시 위치를 조회
router.get("/taxiLocationFind", async (req, res) => {
  try {
    // latitude와 longitude가 있는 드라이버 찾기
    const driversWithLocation = await Driver.find({
      latitude: { $exists: true, $ne: null }, // 존재하고 null 이 아니냐
      longitude: { $exists: true, $ne: null }, //
    });

    console.log("주소가 존재하는 택시드라이버 ", driversWithLocation);

    // 찾은 드라이버들을 JSON 형태로 응답
    res.status(200).json(driversWithLocation);
  } catch (error) {
    console.error("택시 위치 검색 오류:", error);
    res.status(500).json({ error: "서버 오류 발생" });
  }
});

module.exports = router;