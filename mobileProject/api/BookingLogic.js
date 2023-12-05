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
