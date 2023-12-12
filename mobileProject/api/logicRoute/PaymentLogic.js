const express = require("express");
const router = express.Router();
const Payment = require("../models/payment");
const Driver = require("../models/driver")

//로그인한 사람의 결제내역 조회하기
router.get("/payments/boarderId/:userId", async (req, res) => {
    const boarderId = req.params.userId; // URL 경로에서 userId 추출
    console.log(boarderId);
    try {
        const payments = await Payment.find({ boarderId: boarderId }) // Review.find(리시브아이디가 : 요청받은리시브아이디)랑 일치하는지 ?
            .populate("boarderId", "name") // senderId를 참조하여 name 필드만 가져옴 senderId 에 name을 가져옴
            .populate("driverId", "name carNumber", "Driver") // driverId를 참조하여 name 하고 차량번호 가져옴
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

//운전자측에서 결제내역 조회
router.get("/payments/driverId/:userId", async (req, res) => {
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

//결제한 기사 목록 조회
router.get("/driverList/payment/:userId", async (req, res) => {
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

//택시 운전가 수락
router.post("/Payment", async (req, res) => {
    try {
        // POST 요청에서 전달된 데이터 추출
        const { boarderId, driverId, startPoint, endPoint, pay, payDate } =
            req.body;

        // Payment 모델을 사용하여 새로운 결제 내역 생성
        const payment = new Payment({
            boarderId,
            driverId,
            startPoint,
            endPoint,
            pay,
            payDate,
        });

        // 결제 내역을 MongoDB에 저장
        await payment.save();

        // 저장된 데이터를 클라이언트에 응답
        res.status(201).json({ message: "결제 내역이 성공적으로 저장되었습니다." });
    } catch (error) {
        console.error("결제 내역 저장 오류:", error);
        res
            .status(500)
            .json({ message: "결제 내역을 저장하는 중 오류가 발생했습니다." });
    }
});

module.exports = router;