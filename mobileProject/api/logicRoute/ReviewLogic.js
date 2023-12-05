const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const ReviewT = require("../models/reviewT");

// 리뷰 작성
router.post("/write/reviews", (req, res) => {
  // ... 기존 코드 ...
});

router.post("/write/driverReviews", (req, res) => {
  // ... 기존 코드 ...
});

router.get("/reviews/receiver/:userId", (req, res) => {
  // ... 기존 코드 ...
});

router.get("/reviews/receiver/user/:userId", async (req, res) => {
  // ... 기존 코드 ...
});

router.get("/reviews/receiver/driver/:userId", async (req, res) => {
  // ... 기존 코드 ...
});

router.get("/reviews/sender/:userId", async (req, res) => {
  // ... 기존 코드 ...
});

router.get("/reviewsT/sender/:userId", async (req, res) => {
  // ... 기존 코드 ...
});

router.delete("/Review/del/:writeId", async (req, res) => {
  // ... 기존 코드 ...
});

// 다른 라우트 추가 가능 ...

module.exports = router;
