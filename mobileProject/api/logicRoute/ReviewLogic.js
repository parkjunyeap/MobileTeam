const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const ReviewT = require("../models/reviewT");

// 탑승자간에 대한 리뷰작성
router.post("/write/reviews", (req, res) => {
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
      res.status(200).json({ message: "리뷰가 성공적으로 등록됨" });
    })
    .catch((err) => {
      console.log("에러발생 등록못함", err);
      res.status(500).json({ message: "에러발생 등록못함" });
    });
});

// 운전사에 대한 리뷰 작성
router.post("/write/driverReviews", (req, res) => {
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
      res.status(200).json({ message: "택시기사 리뷰가 성공적으로 등록됨" });
    })
    .catch((err) => {
      res.json({
        message: "리뷰 등록 실패",
      });
    });
});

//나에게 남긴 리뷰 조회
router.get("/reviews/receiver/:userId", (req, res) => {
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

//해당 탑승자의 리뷰 조회
router.get("/reviews/receiver/user/:userId", async (req, res) => {
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

//해당 운전자에 대한 리뷰 조회
router.get("/reviews/receiver/driver/:userId", async (req, res) => {
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

//내가 탑승자에게 쓴 리뷰 조회
router.get("/reviews/sender/:userId", async (req, res) => {
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

//내가 운전사에게 쓴 리뷰 조회
router.get("/reviewsT/sender/:userId", async (req, res) => {
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

//리뷰 삭제
router.delete("/Review/del/:writeId", async (req, res) => {
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

// 다른 라우트 추가 가능 ...

module.exports = router;
