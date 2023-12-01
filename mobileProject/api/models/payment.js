const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  // 탑승자유저 ID 추가 하면 리뷰처럼 따로 빼서 관리가능하겠다.
  // 이 결제내역을 택시기사도 볼 수 있게 하고싶었으니까. 택시기사도 자기가 운행을 얼마나해서 금액을 얼마나 받았는지 볼 수 있잖아 이렇게하면

  // 일단 디비에 적재하는 타이밍은
  // 택시잡기 요청했을때로 하자 일단은.
  // 지도에서, 출발지(내가 있는곳 디폴트) ,목적지 정하고
  // 반경 500m 뭐 택시가 보이면 그거 눌러서 부르기 그럼 그 택시의 driverId 가져와서 결제금액도 그냥 일단 임의로 정해서 넣자.
  boarderId: {
    type: mongoose.Schema.Types.ObjectId, // 탑승자를 참조하는 ID
    ref: "User",
  },
  // 누가 탑승했는지도 알아야지 ㅇㅇ
  driverId: {
    type: mongoose.Schema.Types.ObjectId, // 택시 기사를 참조하는 ID
    ref: "driver",
  },
  //  여기서 이름, 차량번호 가져오면 끝.

  boardingDate: {
    //탑승일
    type: Date, // 탑승 시간?
    default: Date.now,
  },
  startPoint: {
    // 출발지
    type: String,
    required: true,
  },
  endPoint: {
    //목적지
    type: String,
    required: true,
  },

  //   carNumber: {
  //     //차량번호   ---> 기사아이디로 대체가능  기사아이디에서 기사이름 참조 , 차량번호 참조
  //     type: String,
  //     required: false,
  //   },
  //   carName: {
  //     // 기사이름 ....> 기사아이디로 대체가능  기사아이디에서 기사이름 참조 , 차량번호 참조
  //     type: String,
  //     require: false,
  //   },

  pay: {
    // 결제금액
    type: String,
    require: false,
  },
});

const Payment = mongoose.model("Payment", paymentSchema); // 'User' 모델로 스키마 컴파일

module.exports = Payment; // 모듈로 내보내기, 다른 파일에서 사용 가능
