const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number, // 결제 금액
    required: true
  },
  paymentDate: {
    type: Date, // 결제 날짜
    default: Date.now
  },
  paymentMethod: {
    type: String, // 결제 방법 (예: 카드, 현금, 전자지갑 등)
    required: true
  },
  taxiRideId: {
    type: mongoose.Schema.Types.ObjectId, // 관련된 택시 라이드의 ID
    ref: 'TaxiRide',
    required: false
  },
  // 필요한 경우 추가적인 필드를 포함할 수 있습니다.
});

module.exports = mongoose.model("PaymentSchema", paymentSchema)