const express = require('express');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

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

// Export the configured app to be used by server.js
module.exports = app;