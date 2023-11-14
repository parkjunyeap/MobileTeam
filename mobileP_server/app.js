const express = require('express');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();

// Middleware to parse JSON bodies and enxable CORS
app.use(express.json());
app.use(cors());

app.post('/verifyToken', (req, res) => {
  const idToken = req.body.idToken;

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      // 여기서 사용자 정보를 검색하거나 데이터베이스 작업을 수행할 수 있습니다.
    })
    .catch((error) => {
      // 토큰 검증 실패 처리
    });
});

// Firebase Admin SDK 초기화
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// MongoDB connection string
const mongoURI = 'mongodb+srv://whathumen:MVv3CzMRK4GKsSJc@cluster0.snqqjz1.mongodb.net/?retryWrites=true&w=majority';

// Connecting to MongoDB
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const User = require('./models/User'); // User 모델을 가져옵니다.

admin
  .auth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
    const uid = decodedToken.uid;

    // Firebase에서 사용자 정보를 가져옵니다.
    return admin.auth().getUser(uid);
  })
  .then((userRecord) => {
    // 여기서 userRecord에는 사용자의 정보가 담겨 있습니다.

    // User 모델을 사용하여 데이터베이스에 사용자 정보를 저장합니다.
    return User.findOneAndUpdate(
      { uid: userRecord.uid },
      {
        displayName: userRecord.displayName,
        email: userRecord.email,
        photoURL: userRecord.photoURL
      },
      { new: true, upsert: true } // 없으면 삽입, 있으면 업데이트 옵션
    );
  })
  .then((user) => {
    // 데이터베이스 작업이 성공적으로 완료되면, 여기서 user 객체를 사용할 수 있습니다.
  })
  .catch((error) => {
    // 에러 처리
  });

// Define your routes here
// 예를 들어, 사용자 라우트와 메시지 라우트를 정의할 수 있습니다.
// app.use('/api/users', require('./routes/users'));
// app.use('/api/messages', require('./routes/messages'));

// Export the configured app to be used by server.js
module.exports = app;