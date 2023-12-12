const express = require('express');
const router = express.Router();
const Booking = require('../models/booking'); // Booking 모델 가져오기

// 예약 생성 라우트
router.post('/bookings', async (req, res) => {
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

// 부킹 드라이버
router.get("/driverList/booking/:userId", async (req, res) => {
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

// 탑승자가 예약한 기사 목록 확인
router.get("/Booking/boarderId/:userId", async (req, res) => {
    const boarderId = req.params.userId; // URL 경로에서 userId 추출
    console.log(boarderId);
    try {
        const bookings = await Booking.find({ boarderId: boarderId }) // Review.find(리시브아이디가 : 요청받은리시브아이디)랑 일치하는지 ?
            .populate("boarderId", "name") // senderId를 참조하여 name 필드만 가져옴 senderId 에 name을 가져옴
            .populate("driverId", "name", "Driver") // driverId를 참조하여 name 하고 차량번호 가져옴
            // 이런식으로 써줘야한다고 하더라고?
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

// 운전자 아이디로 예약한 유저 조회
router.get("/Booking/driverId/:userId", async (req, res) => {
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

// 예약 취소/삭제 
router.delete("/booking/del/:bookingId", async (req, res) => {
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


module.exports = router;
